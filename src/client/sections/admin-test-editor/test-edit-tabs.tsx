"use client";

import { useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

type TabKey = "meta" | "questions" | "results";

interface TestEditTabsProps {
  meta: ReactNode;
  questions: ReactNode;
  results: ReactNode;
}

const TABS: { key: TabKey; label: string }[] = [
  { key: "meta", label: "기본 사항" },
  { key: "questions", label: "문항" },
  { key: "results", label: "결과카드" },
];

/**
 * 테스트 편집 탭(기본 사항 · 문항 · 결과카드) 전환.
 * 패널은 언마운트하지 않고 hidden 으로 감춰 탭 이동 시 입력 상태를 보존한다.
 */
export function TestEditTabs({ meta, questions, results }: TestEditTabsProps) {
  const [active, setActive] = useState<TabKey>("meta");
  const panels: Record<TabKey, ReactNode> = { meta, questions, results };

  return (
    <div className="space-y-6">
      <div
        role="tablist"
        aria-label="테스트 편집 섹션"
        className="flex gap-1 border-b border-border"
      >
        {TABS.map((tab) => {
          const selected = active === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setActive(tab.key)}
              className={cn(
                "-mb-px border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors",
                selected
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {TABS.map((tab) => (
        <div
          key={tab.key}
          role="tabpanel"
          hidden={active !== tab.key}
          className="max-h-[calc(100dvh-18rem)] overflow-y-auto pr-1"
        >
          {panels[tab.key]}
        </div>
      ))}
    </div>
  );
}
