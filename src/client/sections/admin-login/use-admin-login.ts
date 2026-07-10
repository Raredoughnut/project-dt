"use client";

import { useActionState } from "react";

import { loginAction } from "@/src/server/auth/actions";
import type { LoginState } from "@/src/server/auth/types";

const INITIAL_STATE: LoginState = {};

/** 로그인 폼 ViewModel: 서버 액션을 useActionState 로 래핑. */
export function useAdminLogin() {
  const [state, formAction, pending] = useActionState(
    loginAction,
    INITIAL_STATE
  );
  return {
    formAction,
    pending,
    error: state.error,
  };
}

export type AdminLoginVM = ReturnType<typeof useAdminLogin>;
