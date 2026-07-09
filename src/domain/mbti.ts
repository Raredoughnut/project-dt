import type { AxisConfig } from "./types";

/* ========================================================================
   donutest — MBTI 축 정의
   axis 채점의 표준 4축. 순서 = MBTI 코드 자리.
   선택지는 각 축(key)에 부호 점수를 준다:
     - 2문항: +1 / -1
     - 4문항: +1 / +0.5 / -0.5 / -1
   판정: 축 합 > 0 → positive(앞글자), < 0 → negative(뒷글자), = 0 → positive(앞글자).
   ======================================================================== */

export type MbtiAxisKey =
  | "energy" // E / I
  | "information" // S / N
  | "decisions" // T / F
  | "lifestyle"; // J / P

export const MBTI_AXES: AxisConfig[] = [
  { key: "energy", positive: "E", negative: "I" },
  { key: "information", positive: "S", negative: "N" },
  { key: "decisions", positive: "T", negative: "F" },
  { key: "lifestyle", positive: "J", negative: "P" },
];
