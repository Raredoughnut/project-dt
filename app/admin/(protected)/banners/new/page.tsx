import Link from "next/link";

import { BannerFormContainer } from "@/src/client/sections/admin-banners/banner-form-container";

export default function NewBannerPage() {
  return (
    <div className="space-y-6">
      <header>
        <Link
          href="/admin/banners"
          className="text-sm text-muted-foreground transition hover:text-foreground"
        >
          ← 배너 목록
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-foreground">새 배너</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          이미지를 업로드하고 노출 설정을 지정합니다.
        </p>
      </header>

      <BannerFormContainer mode="create" />
    </div>
  );
}
