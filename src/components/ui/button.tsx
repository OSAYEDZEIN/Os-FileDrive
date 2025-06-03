import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-base font-medium transition-all disabled:pointer-events-none disabled:opacity-50 shadow-sm focus-visible:ring-2 focus-visible:ring-gray-300 focus-visible:ring-offset-2 border border-gray-200 bg-white text-gray-900 hover:bg-gray-100 active:bg-gray-200",
  {
    variants: {
      variant: {
        default:
          "bg-gray-900 text-white hover:bg-gray-800 active:bg-gray-700 border-transparent",
        outline:
          "bg-white text-gray-900 border-gray-300 hover:bg-gray-50 active:bg-gray-100",
        secondary:
          "bg-gray-100 text-gray-900 border-gray-200 hover:bg-gray-200 active:bg-gray-300",
        ghost:
          "bg-transparent text-gray-900 hover:bg-gray-100 active:bg-gray-200 border-transparent",
        link: "text-blue-600 underline-offset-4 hover:underline border-transparent bg-transparent",
      },
      size: {
        default: "h-10 px-5 py-2.5",
        sm: "h-8 px-3 py-1.5 text-sm",
        lg: "h-12 px-6 py-3 text-lg",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
