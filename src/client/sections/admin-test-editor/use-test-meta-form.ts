"use client";

import { useActionState } from "react";

import type { TestFormState } from "@/src/server/actions/admin-tests-types";

type MetaAction = (
  prev: TestFormState,
  formData: FormData
) => Promise<TestFormState>;

const INITIAL_STATE: TestFormState = {};

/** 메타 폼 ViewModel: 주입된 서버 액션(생성/수정)을 useActionState로 래핑. */
export function useTestMetaForm(action: MetaAction) {
  const [state, formAction, pending] = useActionState(action, INITIAL_STATE);
  return {
    formAction,
    pending,
    error: state.error,
    ok: state.ok,
  };
}
