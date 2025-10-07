import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-base font-semibold transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30 focus-visible:border-primary focus-visible:scale-[1.02] disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 hover:scale-[1.02] active:brightness-90 active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-elevated hover:shadow-floating",
        destructive: "bg-destructive text-destructive-foreground shadow-elevated hover:shadow-floating",
        outline: "border-2 border-border bg-transparent hover:bg-muted/50 rounded-xl",
        secondary: "border-2 border-border bg-transparent text-foreground hover:bg-muted rounded-xl",
        ghost: "hover:bg-muted hover:text-foreground rounded-lg",
        link: "text-primary underline-offset-4 hover:underline",
        success: "bg-success text-success-foreground shadow-elevated hover:shadow-floating",
        orange: "bg-orange text-white hover:bg-orange-hover shadow-elevated hover:shadow-floating",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 px-5 rounded-xl",
        lg: "h-12 px-8 text-base font-bold",
        icon: "h-12 w-12 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
