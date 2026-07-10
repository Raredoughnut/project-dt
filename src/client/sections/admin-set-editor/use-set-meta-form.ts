"use client";

import { useActionState } from "react";

import type { SetFormState } from "@/src/server/actions/admin-sets-types";

type MetaAction = (
  prev: SetFormState,
  formData: FormData
) => Promise<SetFormState>;

const INITIAL_STATE: SetFormState = {};

/** 세트 메타 폼 ViewModel: 주입된 서버 액션(생성/수정)을 useActionState로 래핑. */
export function useSetMetaForm(action: MetaAction) {
  const [state, formAction, pending] = useActionState(action, INITIAL_STATE);
  return {
    formAction,
    pending,
    error: state.error,
    ok: state.ok,
  };
}
