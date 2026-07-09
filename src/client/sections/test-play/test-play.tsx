"use client";

import { useTestPlay } from "./use-test-play";
import type { PlayableTest } from "./types";
import { NameView } from "./views/name-view";
import { QuestionView } from "./views/question-view";
import { ScoringView } from "./views/scoring-view";

/** 테스트 진행 컨테이너: VM을 호출하고 현재 스텝 뷰를 렌더한다. */
export function TestPlay({ test }: { test: PlayableTest }) {
  const vm = useTestPlay(test);

  return (
    <div className="mx-auto flex min-h-full w-full max-w-md flex-1 flex-col px-4 py-6">
      {vm.step === "name" && <NameView test={test} vm={vm} />}
      {vm.step === "question" && <QuestionView vm={vm} />}
      {vm.step === "scoring" && <ScoringView />}
    </div>
  );
}
