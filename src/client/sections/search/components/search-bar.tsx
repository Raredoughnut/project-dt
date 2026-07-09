"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

/** 검색어를 URL(/search?q=&sort=)로 반영하는 클라이언트 검색창. */
export function SearchBar({
  defaultQuery,
  sort,
}: {
  defaultQuery: string;
  sort: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(defaultQuery);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    const q = value.trim();
    if (q) params.set("q", q);
    if (sort) params.set("sort", sort);
    const query = params.toString();
    router.push(query ? `/search?${query}` : "/search");
  }

  return (
    <form onSubmit={submit} className="flex-1">
      <div className="flex h-11 items-center gap-2 rounded-full border border-border bg-muted px-4">
        <Search className="size-4 shrink-0 text-muted-foreground" />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="테스트 검색"
          className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          aria-label="테스트 검색"
          autoComplete="off"
        />
      </div>
    </form>
  );
}
