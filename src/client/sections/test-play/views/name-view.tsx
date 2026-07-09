import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { PlayableTest } from "../types";
import type { TestPlayVM } from "../use-test-play";

export function NameView({
  test,
  vm,
}: {
  test: PlayableTest;
  vm: TestPlayVM;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        vm.submitName();
      }}
      className="flex flex-1 flex-col items-center justify-center gap-7 text-center"
    >
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-2xl font-bold text-foreground">
          {test.title}
        </h1>
        <p className="text-sm text-muted-foreground">
          이름을 입력하면 결과를 더 특별하게 만들어드려요
        </p>
      </div>

      <Input
        autoFocus
        value={vm.name}
        onChange={(e) => vm.setName(e.target.value)}
        placeholder="이름 또는 닉네임"
        maxLength={20}
        className="h-12 text-center text-base"
        aria-label="이름"
      />

      <Button
        type="submit"
        size="lg"
        disabled={!vm.name.trim()}
        className="w-full"
      >
        시작하기
      </Button>
    </form>
  );
}
