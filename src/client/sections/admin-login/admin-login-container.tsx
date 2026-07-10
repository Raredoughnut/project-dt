"use client";

import { AdminLoginView } from "./admin-login-view";
import { useAdminLogin } from "./use-admin-login";

/** 로그인 Container: ViewModel 훅 호출 → View 에 데이터/콜백 전달. */
export function AdminLoginContainer() {
  const { formAction, pending, error } = useAdminLogin();
  return (
    <AdminLoginView formAction={formAction} pending={pending} error={error} />
  );
}
