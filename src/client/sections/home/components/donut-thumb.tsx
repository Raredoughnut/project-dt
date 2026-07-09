import { cn } from "@/lib/utils";

interface DonutThumbProps {
  src?: string | null;
  alt?: string;
  className?: string;
}

/** 썸네일 자리. coverImage 있으면 이미지, 없으면 도넛 링 플레이스홀더. */
export function DonutThumb({ src, alt, className }: DonutThumbProps) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-xl border border-border bg-primary-lighter",
        className
      )}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt ?? ""} className="h-full w-full object-cover" />
      ) : (
        <span
          className="block size-9 rounded-full border-[9px] border-primary-light"
          aria-hidden
        />
      )}
    </div>
  );
}
