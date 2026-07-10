"use client";

import { useActionState, useState } from "react";

import type { BannerFormState } from "@/src/server/actions/admin-banners-types";

type BannerAction = (
  prev: BannerFormState,
  formData: FormData
) => Promise<BannerFormState>;

const INITIAL_STATE: BannerFormState = {};

/**
 * 배너 폼 ViewModel: 서버 액션(생성/수정)을 useActionState 로 래핑하고,
 * 이미지 파일 선택 시 로컬 미리보기 URL 을 관리한다.
 */
export function useBannerForm(action: BannerAction) {
  const [state, formAction, pending] = useActionState(action, INITIAL_STATE);
  const [pcPreview, setPcPreview] = useState<string | null>(null);
  const [mobilePreview, setMobilePreview] = useState<string | null>(null);

  function onPickPc(file: File | null) {
    setPcPreview(file ? URL.createObjectURL(file) : null);
  }
  function onPickMobile(file: File | null) {
    setMobilePreview(file ? URL.createObjectURL(file) : null);
  }

  return {
    formAction,
    pending,
    error: state.error,
    ok: state.ok,
    pcPreview,
    mobilePreview,
    onPickPc,
    onPickMobile,
  };
}
