import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";

import { getAdminBanner } from "@/src/server/db/queries/banners";
import { BannerFormContainer } from "@/src/client/sections/admin-banners/banner-form-container";
import type { BannerMetaInitial } from "@/src/client/sections/admin-banners/types";

async function EditBanner({ id }: { id: string }) {
  await connection();
  const banner = await getAdminBanner(id);
  if (!banner) notFound();

  const initial: BannerMetaInitial = {
    title: banner.title,
    linkUrl: banner.linkUrl ?? "",
    isActive: banner.isActive,
    sortOrder: banner.sortOrder,
    imageUrl: banner.imageUrl,
    mobileImageUrl: banner.mobileImageUrl,
  };

  return (
    <div className="space-y-6">
      <header>
        <Link
          href="/admin/banners"
          className="text-sm text-muted-foreground transition hover:text-foreground"
        >
          ← 배너 목록
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-foreground">배너 편집</h1>
      </header>

      <BannerFormContainer mode="edit" bannerId={banner.id} initial={initial} />
    </div>
  );
}

export default async function EditBannerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <Suspense
      fallback={<p className="text-sm text-muted-foreground">불러오는 중…</p>}
    >
      <EditBanner id={id} />
    </Suspense>
  );
}
