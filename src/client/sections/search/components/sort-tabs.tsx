import Link from "next/link";
import { cn } from "@/lib/utils";
import type { SearchSort } from "../types";

const TABS: { key: SearchSort; label: string }[] = [
  { key: "popular", label: "인기순" },
  { key: "latest", label: "최신순" },
];

export function SortTabs({ sort, q }: { sort: SearchSort; q: string }) {
  function href(key: SearchSort) {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    params.set("sort", key);
    return `/search?${params.toString()}`;
  }

  return (
    <div className="flex gap-2">
      {TABS.map((tab) => (
        <Link
          key={tab.key}
          href={href(tab.key)}
          className={cn(
            "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
            sort === tab.key
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-muted-foreground hover:text-foreground"
          )}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
