"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import type { BannerItem } from "@/src/client/sections/home/types";

interface BannerCarouselProps {
  banners: BannerItem[];
}

const AUTO_MS = 5000;

/**
 * 메인 기획전 배너 캐러셀(클라이언트).
 * - translateX 트랙으로 슬라이드 전환, 5초 자동 순환(호버·포커스 시 일시정지).
 * - 모바일/PC 이미지는 <picture> 로 분기(모바일 이미지 없으면 PC 폴백).
 * - 배너 1개면 인디케이터·자동순환 없음.
 */
export function BannerCarousel({ banners }: BannerCarouselProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = banners.length;
  const trackRef = useRef<HTMLDivElement>(null);

  const go = useCallback(
    (next: number) => setIndex(((next % count) + count) % count),
    [count]
  );

  useEffect(() => {
    if (count <= 1 || paused) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % count), AUTO_MS);
    return () => clearInterval(timer);
  }, [count, paused]);

  if (count === 0) return null;

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-border bg-secondary"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label="기획전 배너"
    >
      <div
        ref={trackRef}
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {banners.map((b) => (
          <BannerSlide key={b.id} banner={b} />
        ))}
      </div>

      {count > 1 ? (
        <>
          <button
            type="button"
            aria-label="이전 배너"
            onClick={() => go(index - 1)}
            className="absolute left-2 top-1/2 hidden size-9 -translate-y-1/2 items-center justify-center rounded-full bg-background/70 text-foreground shadow-sm backdrop-blur transition hover:bg-background lg:flex"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="다음 배너"
            onClick={() => go(index + 1)}
            className="absolute right-2 top-1/2 hidden size-9 -translate-y-1/2 items-center justify-center rounded-full bg-background/70 text-foreground shadow-sm backdrop-blur transition hover:bg-background lg:flex"
          >
            ›
          </button>

          <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
            {banners.map((b, i) => (
              <button
                key={b.id}
                type="button"
                aria-label={`${i + 1}번째 배너로 이동`}
                aria-current={i === index}
                onClick={() => go(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === index
                    ? "w-3.5 bg-primary"
                    : "w-1.5 bg-background/70 hover:bg-background"
                )}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}

/** 슬라이드 1장: 링크가 있으면 <a>, 없으면 <div>. */
function BannerSlide({ banner }: { banner: BannerItem }) {
  const media = (
    <picture>
      {banner.mobileImageUrl ? (
        <source media="(max-width: 640px)" srcSet={banner.mobileImageUrl} />
      ) : null}
      <img
        src={banner.imageUrl}
        alt={banner.title}
        className="h-36 w-full object-cover lg:h-64"
      />
    </picture>
  );

  const className = "block w-full shrink-0 basis-full";

  if (banner.linkUrl) {
    return banner.linkUrl.startsWith("/") ? (
      <Link href={banner.linkUrl} className={className}>
        {media}
      </Link>
    ) : (
      <a
        href={banner.linkUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {media}
      </a>
    );
  }
  return <div className={className}>{media}</div>;
}
