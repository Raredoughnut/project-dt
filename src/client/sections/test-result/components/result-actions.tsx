"use client";

import { useState } from "react";
import { Check, Download, Link2, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

/** 결과 공유/저장 액션. 공유 URL에 ?ref= 채널 파라미터를 붙여 유입을 추적한다. */
export function ResultActions({ slug, code }: { slug: string; code: string }) {
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);

  const resultPath = `/t/${slug}/r/${code}`;

  function shareUrl(ref: string) {
    const url = new URL(resultPath, window.location.origin);
    url.searchParams.set("ref", ref);
    return url.toString();
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl("copy"));
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* 클립보드 접근 불가 — 무시 */
    }
  }

  async function share() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: document.title, url: shareUrl("share") });
      } catch {
        /* 사용자가 취소 — 무시 */
      }
      return;
    }
    await copyLink();
  }

  async function download() {
    setSaving(true);
    try {
      const res = await fetch(`${resultPath}/opengraph-image`);
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = `donutest-${code}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objectUrl);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Button size="lg" onClick={download} disabled={saving}>
        <Download className="size-4" />
        {saving ? "저장 중…" : "결과 이미지 저장"}
      </Button>
      <div className="flex gap-2">
        <Button
          size="lg"
          variant="outline"
          className="flex-1"
          onClick={share}
        >
          <Share2 className="size-4" />
          공유하기
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="flex-1"
          onClick={copyLink}
        >
          {copied ? <Check className="size-4" /> : <Link2 className="size-4" />}
          {copied ? "복사됨" : "링크 복사"}
        </Button>
      </div>
    </div>
  );
}
