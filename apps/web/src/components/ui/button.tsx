import * as React from "react";

import { cn } from "@/lib/utils";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "ghost" | "destructive";
};

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  default: "bg-[var(--primary)] text-white hover:opacity-95",
  outline: "border border-[var(--border)] bg-white text-[var(--foreground)]",
  ghost: "bg-transparent text-[var(--foreground)]",
  destructive: "bg-[var(--destructive)] text-white hover:opacity-95",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, type = "button", variant = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex h-11 w-full items-center justify-center rounded-2xl px-4 text-sm font-medium transition",
          variants[variant],
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
