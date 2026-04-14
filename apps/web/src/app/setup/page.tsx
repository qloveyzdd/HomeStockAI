import { redirect } from "next/navigation";

import { HouseholdForm } from "@/components/forms/household-form";
import { requireServerSession } from "@/lib/server-session";

export default async function SetupPage() {
  const session = await requireServerSession();

  if (session.setupCompleted) {
    redirect("/items");
  }

  return (
    <main className="mx-auto min-h-screen max-w-[640px] px-4 py-6">
      <div className="mb-6">
        <p className="text-[13px] font-medium text-[var(--muted-foreground)]">第一次使用</p>
        <h1 className="text-[30px] font-bold text-[var(--foreground)]">先建一个家庭档案</h1>
      </div>
      <HouseholdForm mode="create" />
    </main>
  );
}
