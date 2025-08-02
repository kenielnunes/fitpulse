"use client"

import type React from "react"

import { forwardRef } from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, onCheckedChange, ...props }, ref) => {
    return (
      <div className="relative inline-flex items-center">
        <input
          type="checkbox"
          ref={ref}
          checked={checked}
          onChange={(e) => onCheckedChange?.(e.target.checked)}
          className="sr-only"
          {...props}
        />
        <div
          className={cn(
            "h-5 w-5 rounded-lg border-2 border-gray-300 bg-white transition-all duration-200 cursor-pointer",
            "hover:border-blue-500 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/20",
            checked && "bg-gradient-to-r from-blue-500 to-blue-600 border-blue-500",
            className,
          )}
          onClick={() => onCheckedChange?.(!checked)}
        >
          {checked && <Check className="h-3 w-3 text-white m-0.5" />}
        </div>
      </div>
    )
  },
)

Checkbox.displayName = "Checkbox"
