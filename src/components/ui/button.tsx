import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "secondary" | "heroSecondary"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-2xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-skin-lavender disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
          {
            "bg-blue-600 text-white hover:bg-blue-700 active:scale-95": variant === "default",
            "bg-skin-peach text-gray-900 hover:bg-pink-300 active:scale-95": variant === "secondary",
            "bg-white/40 hover:bg-white/60 border border-gray-200/50 backdrop-blur-md text-foreground shadow-sm hover:shadow transition-all": variant === "heroSecondary",
            "border border-gray-200 hover:bg-gray-100 hover:text-gray-900 active:scale-95": variant === "outline",
            "hover:bg-gray-100 hover:text-gray-900": variant === "ghost",
            "h-10 py-2 px-4": size === "default",
            "h-9 px-3": size === "sm",
            "h-12 px-8 rounded-2xl text-base font-semibold": size === "lg",
            "h-10 w-10": size === "icon",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
