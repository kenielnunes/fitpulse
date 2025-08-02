"use client"

import type React from "react"
import { forwardRef } from "react"
import { cn } from "@/lib/utils"

export const Label = forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label ref={ref} className={cn("text-sm font-medium text-gray-700 mb-1 block", className)} {...props} />
  ),
)

Label.displayName = "Label"
