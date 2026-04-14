import { ReactNode } from "react";

import { Button } from "@/components/ui/button";

export function PrimaryActionBar({
  label,
  onClick,
  type = "button",
  disabled,
  secondaryAction,
}: {
  label: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  secondaryAction?: ReactNode;
}) {
  return (
    <div className="sticky bottom-0 -mx-4 mt-8 border-t border-[var(--border)] bg-[var(--background)] px-4 pb-6 pt-4">
      <div className="space-y-3">
        {secondaryAction}
        <Button type={type} onClick={onClick} disabled={disabled}>
          {label}
        </Button>
      </div>
    </div>
  );
}
