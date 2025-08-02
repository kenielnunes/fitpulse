"use client"

import { useState, useEffect } from "react"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

interface Toast {
  id: string
  title: string
  description?: string
  variant?: "default" | "success" | "error" | "warning" | "info"
  duration?: number
}

interface ToastContextType {
  toast: (toast: Omit<Toast, "id">) => void
}

let toastCount = 0
const toasts: Toast[] = []
const listeners: ((toasts: Toast[]) => void)[] = []

export const useToast = (): ToastContextType => {
  return {
    toast: (toast) => {
      const id = (++toastCount).toString()
      const newToast = { ...toast, id }
      toasts.push(newToast)
      listeners.forEach((listener) => listener([...toasts]))

      setTimeout(() => {
        const index = toasts.findIndex((t) => t.id === id)
        if (index > -1) {
          toasts.splice(index, 1)
          listeners.forEach((listener) => listener([...toasts]))
        }
      }, toast.duration || 4000)
    },
  }
}

export const Toaster = () => {
  const [toastList, setToastList] = useState<Toast[]>([])

  useEffect(() => {
    const listener = (newToasts: Toast[]) => setToastList(newToasts)
    listeners.push(listener)
    return () => {
      const index = listeners.indexOf(listener)
      if (index > -1) listeners.splice(index, 1)
    }
  }, [])

  const removeToast = (id: string) => {
    const index = toasts.findIndex((t) => t.id === id)
    if (index > -1) {
      toasts.splice(index, 1)
      listeners.forEach((listener) => listener([...toasts]))
    }
  }

  const getIcon = (variant: Toast["variant"]) => {
    switch (variant) {
      case "success":
        return <CheckCircle className="h-4 w-4" />
      case "error":
        return <AlertCircle className="h-4 w-4" />
      case "warning":
        return <AlertTriangle className="h-4 w-4" />
      case "info":
        return <Info className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  const getVariantStyles = (variant: Toast["variant"]) => {
    switch (variant) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800"
      case "error":
        return "bg-red-50 border-red-200 text-red-800"
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800"
      case "info":
        return "bg-blue-50 border-blue-200 text-blue-800"
      default:
        return "bg-white border-gray-200 text-gray-900"
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toastList.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "flex items-start gap-3 p-4 rounded-lg border shadow-md max-w-sm",
            getVariantStyles(toast.variant),
          )}
        >
          {getIcon(toast.variant)}
          <div className="flex-1">
            <div className="font-medium text-sm">{toast.title}</div>
            {toast.description && <div className="text-sm opacity-90 mt-1">{toast.description}</div>}
          </div>
          <button onClick={() => removeToast(toast.id)} className="opacity-70 hover:opacity-100 transition-opacity">
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
