"use client"

import type React from "react"

import { forwardRef, useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface SelectProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  children: React.ReactNode
  className?: string
}

interface SelectItemProps {
  value: string
  children: React.ReactNode
}

export const Select = ({ value, onValueChange, placeholder, children, className }: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={cn("relative", className)}>
      <SelectTrigger onClick={() => setIsOpen(!isOpen)} isOpen={isOpen}>
        <SelectValue placeholder={placeholder} value={value} />
      </SelectTrigger>
      {isOpen && <SelectContent onClose={() => setIsOpen(false)}>{children}</SelectContent>}
    </div>
  )
}

const SelectTrigger = forwardRef<
  HTMLButtonElement,
  {
    onClick: () => void
    isOpen: boolean
    children: React.ReactNode
  }
>(({ onClick, isOpen, children }, ref) => (
  <button
    ref={ref}
    type="button"
    onClick={onClick}
    className={cn(
      "flex h-12 w-full items-center justify-between rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-base transition-all duration-200",
      "focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20",
      "hover:border-gray-300",
      isOpen && "border-blue-500 ring-4 ring-blue-500/20",
    )}
  >
    {children}
    <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", isOpen && "rotate-180")} />
  </button>
))

SelectTrigger.displayName = "SelectTrigger"

const SelectValue = ({ placeholder, value }: { placeholder?: string; value?: string }) => (
  <span className={cn("text-left", !value && "text-gray-400")}>{value || placeholder}</span>
)

const SelectContent = ({ children, onClose }: { children: React.ReactNode; onClose: () => void }) => {
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute top-full left-0 right-0 z-50 mt-2 max-h-60 overflow-auto rounded-xl border-2 border-gray-200 bg-white shadow-xl">
        {children}
      </div>
    </>
  )
}

export const SelectItem = ({ value, children }: SelectItemProps) => (
  <div
    className="cursor-pointer px-4 py-3 text-base hover:bg-blue-50 hover:text-blue-700 transition-colors duration-150 first:rounded-t-xl last:rounded-b-xl"
    onClick={() => {
      // This would be handled by the parent Select component
    }}
  >
    {children}
  </div>
)
