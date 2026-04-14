"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { apiFetch, normalizeSessionResponse } from "@/lib/api-client";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("13800000000");
  const [password, setPassword] = useState("test123456");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");

    try {
      const response = await apiFetch<{
        account: { id: string; phone: string } | null;
        household_id: string | null;
        setup_completed: boolean;
      }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ phone, password }),
      });

      const session = normalizeSessionResponse(response);
      router.push(session.setupCompleted ? "/items" : "/setup");
      router.refresh();
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "登录失败，请重试");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-[480px] flex-col justify-center px-4 py-10">
      <Card className="bg-white">
        <CardHeader>
          <p className="text-[13px] font-medium text-[var(--muted-foreground)]">家补 AI</p>
          <CardTitle className="text-[30px]">登录并开始</CardTitle>
          <CardDescription>先用测试账号进入，跑通 Phase 1 的登录、建档和物品管理。</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="phone">手机号</Label>
              <Input id="phone" value={phone} onChange={(event) => setPhone(event.target.value)} />
            </div>
            <div>
              <Label htmlFor="password">密码</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>

            <Card className="bg-[var(--surface)]">
              <CardContent className="space-y-2">
                <p className="text-sm font-medium text-[var(--foreground)]">测试账号说明</p>
                <p className="text-sm text-[var(--muted-foreground)]">手机号：13800000000</p>
                <p className="text-sm text-[var(--muted-foreground)]">密码：test123456</p>
              </CardContent>
            </Card>

            {error ? <p className="text-sm text-[var(--destructive)]">{error}</p> : null}

            <Button type="submit" disabled={pending}>
              登录并开始
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
