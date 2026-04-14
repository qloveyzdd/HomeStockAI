import { AppShell } from "@/components/app-shell";
import { HouseholdForm } from "@/components/forms/household-form";
import { LogoutButton } from "@/components/logout-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { serverApiFetch } from "@/lib/server-api";
import { requireServerSession } from "@/lib/server-session";

export default async function SettingsPage() {
  const session = await requireServerSession();
  const household = await serverApiFetch<{
    id: string;
    owner_account_id: string;
    household_size: number;
    has_pet: boolean;
    pet_type: string | null;
    has_baby: boolean;
    storage_level: "small" | "medium" | "large";
    price_sensitivity: "low" | "medium" | "high";
    stock_style: "light" | "normal" | "heavy";
    preferred_platforms: string[] | null;
    reminder_tolerance: "low" | "medium" | "high" | null;
  } | null>("/household/me");

  return (
    <AppShell title="设置" activeTab="settings">
      <div className="space-y-4">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>当前账号</CardTitle>
            <CardDescription>先保留最简单的单主账号模式。</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-[var(--muted-foreground)]">手机号</p>
              <p className="text-base font-semibold text-[var(--foreground)]">{session.account?.phone}</p>
            </div>
            <LogoutButton />
          </CardContent>
        </Card>

        {household ? <HouseholdForm mode="edit" householdId={household.id} initialValue={household} /> : null}
      </div>
    </AppShell>
  );
}

