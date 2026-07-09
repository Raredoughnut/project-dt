import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-md border border-transparent font-sans font-semibold whitespace-nowrap leading-none select-none transition-[background,border-color,box-shadow,transform] duration-150 outline-none cursor-pointer focus-visible:ring-3 focus-visible:ring-ring/30 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground hover:bg-[oklch(from_var(--primary)_calc(l+0.06)_c_h)]",
        accent: "bg-primary-dark text-white hover:bg-primary-darker",
        outline:
          "bg-transparent text-foreground border-border hover:bg-secondary",
        ghost: "bg-transparent text-foreground hover:bg-secondary",
        link: "bg-transparent text-foreground px-1 h-auto hover:text-primary-dark hover:underline underline-offset-4",
        destructive:
          "bg-destructive text-white hover:bg-[oklch(from_var(--destructive)_calc(l-0.05)_c_h)]",
      },
      size: {
        default: "h-9 px-3.5 text-sm",
        sm: "h-[30px] px-2.5 text-[13px] rounded-sm",
        lg: "h-11 px-[18px] text-[15px]",
        icon: "h-9 w-9 px-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants };
