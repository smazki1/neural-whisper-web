import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 touch-manipulation active:scale-95",
  {
    variants: {
      variant: {
        default: "modern-button-primary",
        secondary: "modern-button-secondary", 
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border-2 border-input bg-background hover:bg-muted hover:text-foreground rounded-xl",
        ghost: "modern-button-ghost",
        link: "text-blue-600 underline-offset-4 hover:underline font-medium",
        accent: "bg-emerald-500 text-white hover:bg-emerald-600 rounded-xl font-semibold",
      },
      size: {
        default: "px-6 py-3 text-base min-h-[44px] rounded-xl",
        sm: "px-4 py-2 text-sm min-h-[36px] rounded-lg",
        lg: "px-8 py-4 text-lg min-h-[52px] rounded-xl",
        icon: "h-11 w-11 min-h-[44px] min-w-[44px] rounded-xl",
        mobile: "px-6 py-3 text-base min-h-[48px] rounded-xl",
        "mobile-lg": "px-8 py-4 text-lg min-h-[56px] rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
