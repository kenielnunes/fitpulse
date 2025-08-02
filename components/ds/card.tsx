"use client"

import type React from "react"
import { forwardRef } from "react"
import { cn } from "@/lib/utils"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "bordered"
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({ className, variant = "default", ...props }, ref) => {
  const variants = {
    default: "bg-white shadow-sm border border-gray-200",
    bordered: "bg-white border-2 border-gray-100",
  }

  return (
    <div
      ref={ref}
      className={cn("rounded-lg transition-colors duration-200", variants[variant], className)}
      {...props}
    />
  )
})

Card.displayName = "Card"

export const CardHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-6", className)} {...props} />,
)

CardHeader.displayName = "CardHeader"

export const CardTitle = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-lg font-semibold text-gray-900", className)} {...props} />
  ),
)

CardTitle.displayName = "CardTitle"

export const CardDescription = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => <p ref={ref} className={cn("text-sm text-gray-600", className)} {...props} />,
)

CardDescription.displayName = "CardDescription"

export const CardContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />,
)

CardContent.displayName = "CardContent"
