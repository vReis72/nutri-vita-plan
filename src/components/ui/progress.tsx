
import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"
import { cva } from "class-variance-authority";

const progressVariants = cva(
  "relative h-4 w-full overflow-hidden rounded-full transition-all",
  {
    variants: {
      variant: {
        default: "bg-secondary/20",
        success: "bg-green-100 dark:bg-green-900/20",
        warning: "bg-yellow-100 dark:bg-yellow-900/20",
        danger: "bg-red-100 dark:bg-red-900/20",
        info: "bg-blue-100 dark:bg-blue-900/20"
      },
      size: {
        sm: "h-2",
        md: "h-4",
        lg: "h-6"
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md"
    }
  }
);

const indicatorVariants = cva(
  "h-full w-full flex-1 transition-all duration-500 ease-in-out",
  {
    variants: {
      variant: {
        default: "bg-primary",
        success: "bg-green-500",
        warning: "bg-yellow-500",
        danger: "bg-red-500",
        info: "bg-blue-500"
      },
      animated: {
        true: "animate-pulse",
        false: ""
      },
      striped: {
        true: "bg-gradient-to-r from-transparent to-white/10 bg-[length:20px_20px]",
        false: ""
      }
    },
    defaultVariants: {
      variant: "default",
      animated: false,
      striped: false
    }
  }
);

interface ProgressProps extends 
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  variant?: "default" | "success" | "warning" | "danger" | "info";
  size?: "sm" | "md" | "lg";
  animated?: boolean;
  striped?: boolean;
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, variant, size, animated, striped, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(progressVariants({ variant, size }), className)}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={cn(
        indicatorVariants({ variant, animated, striped })
      )}
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
