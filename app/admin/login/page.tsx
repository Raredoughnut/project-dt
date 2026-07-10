import type { Metadata } from "next";

import { AdminLoginContainer } from "@/src/client/sections/admin-login/admin-login-container";

export const metadata: Metadata = {
  title: "관리자 로그인 · donutest",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return <AdminLoginContainer />;
}
