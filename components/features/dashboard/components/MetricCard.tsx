import { Card, CardContent, CardHeader, CardTitle } from "@/components/shared/ui/Card"
import { cn } from "@/lib/utils"
import type { ElementType } from "react"

interface MetricCardProps {
  title: string
  value: string | number
  subtitle: string
  icon: ElementType
  iconBgColor?: string
  iconColor?: string
  className?: string
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBgColor = "bg-gray-100",
  iconColor = "text-gray-600",
  className,
}: MetricCardProps) {
  return (
    <Card className={cn("hover:shadow-lg hover:-translate-y-1 transition-all duration-300", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-inherit">{title}</CardTitle>
        <div className={cn("h-8 w-8 flex items-center justify-center rounded-full", iconBgColor, iconColor)}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        <p className="text-xs text-inherit/80 mt-1">{subtitle}</p>
      </CardContent>
    </Card>
  )
}