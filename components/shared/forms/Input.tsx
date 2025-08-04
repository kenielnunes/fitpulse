"use client"

import type React from "react"
import { forwardRef } from "react"
import { cn } from "@/lib/utils"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, type, error, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm transition-colors",
        "placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50",
        error && "border-red-500 focus:border-red-500 focus:ring-red-500",
        className,
      )}
      ref={ref}
      {...props}
    />
  )
})

Input.displayName = "Input"
