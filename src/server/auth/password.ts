import { hash, verify } from "@node-rs/argon2";

/* 비밀번호 해싱 — argon2id(기본 알고리즘).
   파라미터는 OWASP 권장 최소치(메모리 19MiB · 반복 2 · 병렬 1). */
const HASH_OPTIONS = {
  memoryCost: 19456,
  timeCost: 2,
  parallelism: 1,
};

/** 평문 → argon2id 해시(인코딩 문자열, 솔트 포함). */
export function hashPassword(plain: string): Promise<string> {
  return hash(plain, HASH_OPTIONS);
}

/** 저장된 해시와 평문 비교. 형식 오류 등은 false 로 처리. */
export async function verifyPassword(
  passwordHash: string,
  plain: string
): Promise<boolean> {
  try {
    return await verify(passwordHash, plain);
  } catch {
    return false;
  }
}
