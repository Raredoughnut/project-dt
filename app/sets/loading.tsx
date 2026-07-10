import { RouteLoading } from "@/src/client/sections/loading/route-loading";

// /sets 및 /sets/[slug] 이동 시 즉시 노출되는 로딩 화면.
export default function Loading() {
  return <RouteLoading />;
}
