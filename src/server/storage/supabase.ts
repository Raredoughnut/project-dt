import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/* ========================================================================
   Supabase Storage — 이미지 업로드/삭제 (공개 버킷).
   서버 전용. SERVICE_ROLE 키를 사용하므로 절대 클라이언트로 노출하지 않는다.
   필요한 env:
     - SUPABASE_URL                 (예: https://<ref>.supabase.co)
     - SUPABASE_SERVICE_ROLE_KEY    (Service role 키)
     - SUPABASE_STORAGE_BUCKET      (선택, 배너 버킷, 기본 'banners')
     - SUPABASE_IMAGES_BUCKET       (선택, 테스트/결과 이미지 버킷, 기본 'images')
   위 버킷들은 Supabase 대시보드에서 Public 으로 생성해두어야 한다.
   ======================================================================== */

/** 배너 이미지 버킷 */
export const BANNERS_BUCKET = process.env.SUPABASE_STORAGE_BUCKET ?? "banners";
/** 테스트 대표/결과카드 이미지 버킷 */
export const IMAGES_BUCKET = process.env.SUPABASE_IMAGES_BUCKET ?? "images";

/** 허용 이미지 MIME 및 용량 제한(5MB). */
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

let cached: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (cached) return cached;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Supabase Storage 환경변수(SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)가 없습니다. .env 를 확인하세요."
    );
  }
  cached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}

function extFor(file: File): string {
  const fromName = file.name.split(".").pop()?.toLowerCase();
  if (fromName && /^[a-z0-9]{1,5}$/.test(fromName)) return fromName;
  const fromMime = file.type.split("/").pop()?.toLowerCase();
  return fromMime && /^[a-z0-9]{1,5}$/.test(fromMime) ? fromMime : "png";
}

/** 업로드 전 파일 유효성 검사. 문제 있으면 사용자용 메시지 반환, 없으면 null. */
export function validateImageFile(file: File): string | null {
  if (file.size === 0) return "이미지 파일이 비어있습니다.";
  if (file.size > MAX_IMAGE_BYTES) return "이미지는 5MB 이하만 업로드할 수 있어요.";
  if (!ALLOWED_MIME.has(file.type))
    return "이미지 형식은 JPG·PNG·WebP·GIF·AVIF 만 지원해요.";
  return null;
}

/**
 * 이미지를 공개 버킷에 업로드하고 공개 URL 을 반환한다.
 * @param file 업로드할 이미지
 * @param keyPrefix 파일명 접두(경로 구분용, 예: 'test-cover', 'result', 'pc')
 * @param bucket 대상 버킷(기본 IMAGES_BUCKET)
 */
export async function uploadImage(
  file: File,
  keyPrefix: string,
  bucket: string = IMAGES_BUCKET
): Promise<string> {
  const path = `${keyPrefix}/${crypto.randomUUID()}.${extFor(file)}`;
  const bytes = new Uint8Array(await file.arrayBuffer());

  const { error } = await getClient()
    .storage.from(bucket)
    .upload(path, bytes, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
      cacheControl: "31536000",
    });
  if (error) {
    throw new Error(`이미지 업로드 실패: ${error.message}`);
  }

  const { data } = getClient().storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * 공개 URL 로부터 버킷 내부 경로를 역산해 파일을 삭제한다(베스트 에포트).
 * 저장 버킷이 아닌 외부 URL 이면 무시한다.
 */
export async function deleteImageByUrl(
  publicUrl: string | null | undefined,
  bucket: string = IMAGES_BUCKET
): Promise<void> {
  if (!publicUrl) return;
  const marker = `/storage/v1/object/public/${bucket}/`;
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) return;
  const path = publicUrl.slice(idx + marker.length);
  if (!path) return;
  await getClient().storage.from(bucket).remove([path]);
}

/* ── 배너 전용 래퍼(기존 호출부 호환) ─────────────────────────────────────── */

export function uploadBannerImage(file: File, keyPrefix: string): Promise<string> {
  return uploadImage(file, keyPrefix, BANNERS_BUCKET);
}

export function deleteBannerImageByUrl(
  publicUrl: string | null | undefined
): Promise<void> {
  return deleteImageByUrl(publicUrl, BANNERS_BUCKET);
}
