import Link from "next/link";
import { ReactNode } from "react";

import { cn } from "@/lib/utils";

const tabs = [
  { href: "/items", label: "物品" },
  { href: "/settings", label: "设置" },
] as const;

export function AppShell({
  title,
  activeTab,
  action,
  children,
}: {
  title: string;
  activeTab: "items" | "settings";
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto min-h-screen max-w-[640px] pb-28">
      <header className="sticky top-0 z-10 bg-[var(--background)]/95 px-4 pb-4 pt-6 backdrop-blur">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[13px] font-medium text-[var(--muted-foreground)]">家补 AI</p>
            <h1 className="text-[22px] font-bold text-[var(--foreground)]">{title}</h1>
          </div>
          {action}
        </div>
      </header>

      <main className="px-4">{children}</main>

      <nav className="fixed bottom-0 left-1/2 w-full max-w-[640px] -translate-x-1/2 border-t border-[var(--border)] bg-[var(--background)] px-4 py-3">
        <div className="grid grid-cols-2 gap-3 rounded-3xl bg-white p-2 shadow-sm">
          {tabs.map((tab) => {
            const isActive = activeTab === (tab.href === "/items" ? "items" : "settings");
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "rounded-2xl px-4 py-3 text-center text-sm font-medium transition",
                  isActive ? "bg-[var(--primary)] text-white" : "text-[var(--muted-foreground)]",
                )}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
