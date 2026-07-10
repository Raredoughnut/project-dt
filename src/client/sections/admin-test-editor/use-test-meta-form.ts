"use client";

import { useActionState, useState } from "react";

import type { TestFormState } from "@/src/server/actions/admin-tests-types";

type MetaAction = (
  prev: TestFormState,
  formData: FormData
) => Promise<TestFormState>;

const INITIAL_STATE: TestFormState = {};

/**
 * 메타 폼 ViewModel: 서버 액션(생성/수정)을 useActionState로 래핑하고,
 * 대표 이미지 선택 시 로컬 미리보기 URL 을 관리한다.
 */
export function useTestMetaForm(action: MetaAction) {
  const [state, formAction, pending] = useActionState(action, INITIAL_STATE);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  function onPickCover(file: File | null) {
    setCoverPreview(file ? URL.createObjectURL(file) : null);
  }

  return {
    formAction,
    pending,
    error: state.error,
    ok: state.ok,
    coverPreview,
    onPickCover,
  };
}
