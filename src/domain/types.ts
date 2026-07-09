/* ========================================================================
   donutest — 도메인 타입 (순수, DB/프레임워크 비의존)
   채점 엔진의 입출력 계약. 서버/클라 양쪽에서 재사용한다.
   ======================================================================== */

/** 선택지가 각 차원(sum: 결과코드 / axis: 폴 문자)에 기여하는 점수 맵. 예: { classic: 1 } */
export type ScoreMap = Record<string, number>;

/** 채점 방식 (DB tests.scoring_type 와 동일) */
export type ScoringType = "sum" | "axis";

/**
 * axis 채점의 축 하나. positive/negative 폴 문자를 순서대로 이어 결과 코드를 만든다.
 * 예: { positive: "E", negative: "I" } × 4축 → "ENFP"
 */
export interface AxisConfig {
  positive: string;
  negative: string;
}

export interface ScoreInput {
  scoringType: ScoringType;
  /** 질문별로 선택된 선택지의 점수 맵 목록 (순서 무관, 전부 합산) */
  selectedScores: ScoreMap[];
  /** sum 전용: 동점 시 우선순위 코드 목록. 없으면 사전순. */
  tieBreak?: string[];
  /** axis 전용: 축 구성(순서대로 코드 구성). scoringType이 axis일 때 필수. */
  axes?: AxisConfig[];
}

export interface ScoreResult {
  /** 결정된 결과 코드 (ResultCard.code 와 매칭) */
  code: string;
  /** 차원별 합산 점수 */
  totals: ScoreMap;
}
