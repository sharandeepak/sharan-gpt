"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "outline"
  | "danger";

export type ButtonSize = "sm" | "md" | "icon";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-accent !text-accent-fg hover:opacity-90",
  secondary:
    "bg-panel-soft text-fg border border-border hover:border-border-strong",
  outline:
    "bg-transparent text-fg border border-border hover:bg-panel-soft",
  ghost:
    "bg-transparent text-fg-muted hover:bg-panel-soft hover:text-fg",
  danger:
    "bg-transparent text-danger border border-border hover:bg-panel-soft",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-[13px]",
  md: "h-9 px-4 text-[14px]",
  icon: "h-9 w-9 px-0 grid place-items-center",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-md font-medium select-none transition-[opacity,colors,background-color,border-color] duration-[120ms] ease-[var(--ease-out-quart)] disabled:pointer-events-none disabled:opacity-50";

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      className,
      variant = "secondary",
      size = "md",
      asChild = false,
      children,
      type,
      ...props
    },
    ref
  ) {
    const merged = cn(
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      className
    );

    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<
        React.HTMLAttributes<HTMLElement> & { className?: string }
      >;
      return React.cloneElement(child, {
        ...props,
        ...child.props,
        className: cn(merged, child.props.className),
        ref,
      } as React.HTMLAttributes<HTMLElement> & {
        className?: string;
        ref?: React.Ref<HTMLElement>;
      });
    }

    return (
      <button
        ref={ref}
        type={type ?? "button"}
        className={merged}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
