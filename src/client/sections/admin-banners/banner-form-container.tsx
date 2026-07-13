"use client";

import {
  createBannerAction,
  updateBannerAction,
} from "@/src/server/actions/admin-banners";
import { BannerFormView } from "./banner-form-view";
import { useBannerForm } from "./use-banner-form";
import type { BannerMetaInitial } from "./types";

interface BannerFormContainerProps {
  mode: "create" | "edit";
  bannerId?: string;
  initial?: BannerMetaInitial;
}

/** 배너 폼 Container: 모드에 따라 생성/수정 액션 선택. */
export function BannerFormContainer({
  mode,
  bannerId,
  initial,
}: BannerFormContainerProps) {
  const action = mode === "create" ? createBannerAction : updateBannerAction;
  const vm = useBannerForm(action);

  return (
    <BannerFormView
      mode={mode}
      bannerId={bannerId}
      initial={initial}
      formAction={vm.formAction}
      pending={vm.pending}
      error={vm.error}
      ok={vm.ok}
      pcPreview={vm.pcPreview}
      mobilePreview={vm.mobilePreview}
      onPickPc={vm.onPickPc}
      onPickMobile={vm.onPickMobile}
    />
  );
}
