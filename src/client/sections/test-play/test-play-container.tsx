"use client";

import { useTestPlay } from "@/src/client/sections/test-play/use-test-play";
import type { PlayableTest } from "@/src/client/sections/test-play/types";
import { NameView } from "@/src/client/sections/test-play/views/name-view";
import { QuestionView } from "@/src/client/sections/test-play/views/question-view";
import { ScoringView } from "@/src/client/sections/test-play/views/scoring-view";

/**
 * 테스트 진행 클라이언트 컨테이너.
 * ViewModel(useTestPlay) 호출 → 현재 스텝(step) 분기 → 스텝 View 렌더 (MVVM).
 * 초기 데이터(test)는 서버에서 주입받는다 (fetch-strategy §6).
 */
export function TestPlayContainer({ test }: { test: PlayableTest }) {
  const vm = useTestPlay(test);

  return (
    <div className="mx-auto flex min-h-full w-full max-w-md flex-1 flex-col px-4 py-6">
      {vm.step === "name" && <NameView test={test} vm={vm} />}
      {vm.step === "question" && <QuestionView vm={vm} />}
      {vm.step === "scoring" && <ScoringView />}
    </div>
  );
}
