"use client"

import { Search } from "lucide-react"
import { Card, CardContent } from "../ui/Card"

interface EmptyStateCardProps {
  description: string
  icon?: React.ReactNode
}

export function EmptyStateCard({ description, icon }: EmptyStateCardProps) {
  return (
    <Card>
      <CardContent className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          {icon || <Search className="h-8 w-8 text-gray-400" />}
        </div>
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  )
} 