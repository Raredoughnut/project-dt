import { ChevronLeft } from "lucide-react";
import { ChoiceButton } from "../components/choice-button";
import { ProgressBar } from "../components/progress-bar";
import type { TestPlayVM } from "../use-test-play";

export function QuestionView({ vm }: { vm: TestPlayVM }) {
  const question = vm.currentQuestion;
  if (!question) return null;

  return (
    <div className="flex flex-1 flex-col gap-7">
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <button
            type="button"
            onClick={vm.back}
            className="flex items-center gap-0.5 rounded-md py-1 pr-1.5 hover:text-foreground"
            aria-label="이전"
          >
            <ChevronLeft className="size-4" />
            이전
          </button>
          <span>
            {vm.index + 1} / {vm.total}
          </span>
        </div>
        <ProgressBar value={(vm.index / vm.total) * 100} />
      </div>

      <h2 className="font-display text-xl font-bold leading-snug text-foreground">
        {question.text}
      </h2>

      <div className="flex flex-col gap-3">
        {question.choices.map((choice) => (
          <ChoiceButton
            key={choice.id}
            label={choice.label}
            onClick={() => vm.answer(choice.id)}
          />
        ))}
      </div>
    </div>
  );
}
