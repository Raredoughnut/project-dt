import Link from "next/link";
import type { Test } from "@/src/server/db/schema";
import { DonutThumb } from "@/src/client/sections/home/components/donut-thumb";

interface TestCardProps {
  test: Pick<Test, "slug" | "title" | "coverImage">;
  rank?: number;
  meta?: string;
  className?: string;
}

export function TestCard({ test, rank, meta, className }: TestCardProps) {
  return (
    <Link href={`/t/${test.slug}`} className={className}>
      <div className="relative">
        <DonutThumb src={test.coverImage} alt={test.title} className="aspect-[4/3]" />
        {rank ? (
          <span className="absolute left-1.5 top-1.5 flex size-6 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
            {rank}
          </span>
        ) : null}
      </div>
      <p className="mt-2 line-clamp-2 text-sm font-medium text-foreground">
        {test.title}
      </p>
      {meta ? (
        <p className="mt-0.5 text-xs text-muted-foreground">{meta}</p>
      ) : null}
    </Link>
  );
}
