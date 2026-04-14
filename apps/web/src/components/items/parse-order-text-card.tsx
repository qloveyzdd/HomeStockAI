"use client";

import { useState } from "react";

import type { ParseOrderTextCandidate } from "@refillwise/shared-types";

import {
  apiFetch,
  normalizeParseOrderTextCandidate,
  type ParseOrderTextCandidateApiResponse,
} from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ParseOrderTextCard({
  onFill,
}: {
  onFill: (candidate: ParseOrderTextCandidate, rawText: string) => void;
}) {
  const [text, setText] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");

  async function handleParse() {
    if (!text.trim()) {
      setMessage("先把订单文字贴进来，我再帮你识别。");
      return;
    }

    setPending(true);
    setMessage("");
    try {
      const payload = await apiFetch<ParseOrderTextCandidateApiResponse>("/purchase-records/parse-text", {
        method: "POST",
        body: JSON.stringify({ text }),
      });
      const candidate = normalizeParseOrderTextCandidate(payload);
      if (!candidate.platform && !candidate.skuTitle && !candidate.quantity && !candidate.totalPrice) {
        setMessage("这段内容我还没完全看懂，你可以继续手动填写。");
        return;
      }
      onFill(candidate, text);
      setMessage("我已经把能识别的内容回填到表单里了。");
    } catch {
      setMessage("这次没识别出来，你可以继续手动填写。");
    } finally {
      setPending(false);
    }
  }

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle>粘贴订单文本</CardTitle>
        <CardDescription>把订单里的文字贴过来，我先帮你补几项字段。</CardDescription>
      </CardHeader>
      <CardContent>
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="例如：京东 维达卷纸 4提 x2 实付 ¥59"
          className="min-h-32 w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] outline-none"
        />
        <Button type="button" className="w-auto px-4" disabled={pending} onClick={handleParse}>
          帮我识别
        </Button>
        {message ? <p className="text-sm text-[var(--muted-foreground)]">{message}</p> : null}
      </CardContent>
    </Card>
  );
}
