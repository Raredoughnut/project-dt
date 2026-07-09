import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  href?: string;
}

export function SectionHeader({ title, href }: SectionHeaderProps) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-lg font-medium text-foreground lg:text-xl">{title}</h2>
      {href ? (
        <Link
          href={href}
          className="flex items-center gap-0.5 text-xs text-primary"
        >
          전체보기
          <ChevronRight className="size-3.5" />
        </Link>
      ) : null}
    </div>
  );
}
