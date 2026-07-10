import { RouteLoading } from "@/src/client/sections/loading/route-loading";

// /t/[slug] 및 하위(play, r/[code]) 이동 시 즉시 노출되는 로딩 화면.
export default function Loading() {
  return <RouteLoading />;
}
