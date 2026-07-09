"use client";

import { useCallback, useEffect, useMemo, useReducer } from "react";
import { useRouter } from "next/navigation";

import { collectSelectedScores, score } from "@/src/domain/scoring";
import type { PlayableTest } from "./types";

/* 테스트 진행 상태머신: name → question → scoring → (결과 URL로 이동) */

type Step = "name" | "question" | "scoring";

interface State {
  step: Step;
  name: string;
  index: number; // 현재 문항 인덱스
  answers: Record<string, string>; // questionId → choiceId
}

type Action =
  | { type: "setName"; name: string }
  | { type: "submitName" }
  | { type: "answer"; questionId: string; choiceId: string }
  | { type: "back" };

function makeReducer(total: number) {
  return (state: State, action: Action): State => {
    switch (action.type) {
      case "setName":
        return { ...state, name: action.name };
      case "submitName":
        return state.name.trim()
          ? { ...state, step: "question", index: 0 }
          : state;
      case "answer": {
        const answers = { ...state.answers, [action.questionId]: action.choiceId };
        const next = state.index + 1;
        return next >= total
          ? { ...state, answers, step: "scoring" }
          : { ...state, answers, index: next };
      }
      case "back": {
        if (state.step !== "question") return state;
        return state.index === 0
          ? { ...state, step: "name" }
          : { ...state, index: state.index - 1 };
      }
      default:
        return state;
    }
  };
}

/** 채점 애니메이션 노출 시간(ms) */
const SCORING_DURATION = 2500;

export function useTestPlay(test: PlayableTest) {
  const router = useRouter();
  const total = test.questions.length;
  const reducer = useMemo(() => makeReducer(total), [total]);
  const [state, dispatch] = useReducer(reducer, {
    step: "name",
    name: "",
    index: 0,
    answers: {},
  });

  const currentQuestion =
    state.step === "question" ? test.questions[state.index] : null;

  const progress =
    total > 0
      ? Math.round((Object.keys(state.answers).length / total) * 100)
      : 0;

  // scoring 진입 시 도메인 엔진으로 결과 코드 계산
  const resultCode = useMemo(() => {
    if (state.step !== "scoring") return null;
    const answers = test.questions.map((q) => ({
      questionId: q.id,
      choiceId: state.answers[q.id],
    }));
    const selected = collectSelectedScores(test.questions, answers);
    return score({ scoringType: test.scoringType, selectedScores: selected }).code;
  }, [state.step, state.answers, test]);

  // 채점 애니메이션 후 결과 페이지로 이동
  useEffect(() => {
    if (state.step !== "scoring" || !resultCode) return;

    // TODO(로드맵 6): recordAttempt 서버 액션 호출 (유입 채널 포함)

    const params = new URLSearchParams();
    const name = state.name.trim();
    if (name) params.set("name", name);
    const query = params.toString();
    const url = `/t/${test.slug}/r/${resultCode}${query ? `?${query}` : ""}`;

    const timer = setTimeout(() => router.push(url), SCORING_DURATION);
    return () => clearTimeout(timer);
  }, [state.step, resultCode, state.name, test.slug, router]);

  const setName = useCallback(
    (name: string) => dispatch({ type: "setName", name }),
    []
  );
  const submitName = useCallback(() => dispatch({ type: "submitName" }), []);
  const back = useCallback(() => dispatch({ type: "back" }), []);
  const answer = useCallback(
    (choiceId: string) => {
      if (!currentQuestion) return;
      dispatch({ type: "answer", questionId: currentQuestion.id, choiceId });
    },
    [currentQuestion]
  );

  return {
    step: state.step,
    name: state.name,
    setName,
    submitName,
    currentQuestion,
    index: state.index,
    total,
    progress,
    answer,
    back,
  };
}

export type TestPlayVM = ReturnType<typeof useTestPlay>;
