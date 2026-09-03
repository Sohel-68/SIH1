import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const typographyVariants = cva("text-foreground", {
  variants: {
    variant: {
      h1: "typo-heading-1",
      h2: "typo-heading-2",
      h3: "typo-heading-3",
      title: "typo-title",
      subtitle: "typo-subtitle",
      body: "typo-body",
      caption: "typo-caption",
      label: "typo-label",
      mono: "typo-mono",
    },
    color: {
      default: "",
      muted: "text-muted-foreground",
      primary: "text-gov-primary",
      accent: "text-gov-accent",
      success: "text-gov-success",
      warning: "text-gov-warning",
      danger: "text-gov-danger",
    },
  },
  defaultVariants: {
    variant: "body",
    color: "default",
  },
});

type ElementType = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "label" | "code";

export interface TypographyProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "color">,
    VariantProps<typeof typographyVariants> {
  as?: ElementType;
}

const defaultElementMap: Record<NonNullable<VariantProps<typeof typographyVariants>["variant"]>, ElementType> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  title: "h4",
  subtitle: "p",
  body: "p",
  caption: "span",
  label: "label",
  mono: "code",
};

export const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ className, variant = "body", color, as, children, ...props }, ref) => {
    const Component = as || (variant ? defaultElementMap[variant] : "p");

    return React.createElement(
      Component,
      {
        ref,
        className: cn(typographyVariants({ variant, color, className })),
        ...props,
      },
      children
    );
  }
);
Typography.displayName = "Typography";
