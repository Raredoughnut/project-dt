import Link from "next/link";
import type { CuratedSet } from "@/src/client/sections/home/types";
import { DonutThumb } from "@/src/client/sections/home/components/donut-thumb";

interface SetCardProps {
  set: CuratedSet;
}

export function SetCard({ set }: SetCardProps) {
  // set.items 는 Container/쿼리에서 최대 3개로 제한됨 (View 가공 금지 §4)
  return (
    <Link
      href={`/sets/${set.slug}`}
      className="flex flex-col gap-3 rounded-2xl border border-border bg-secondary p-4"
    >
      <span className="text-sm font-medium text-foreground">{set.title}</span>
      <div className="flex gap-2">
        {set.items.map((item) => (
          <DonutThumb
            key={item.id}
            src={item.coverImage}
            alt={item.title}
            className="aspect-[4/3] flex-1"
          />
        ))}
      </div>
    </Link>
  );
}
