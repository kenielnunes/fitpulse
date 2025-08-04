import { Card, CardContent, CardHeader, CardTitle } from "@/components/shared/ui/Card"
import { Button } from "@/components/shared/ui/Button"
import Link from "next/link"
import type { ElementType, ReactNode } from "react"

interface DashboardSectionCardProps {
  title: string
  icon: ElementType
  buttonText: string
  buttonHref: string
  children: ReactNode
}

export function DashboardSectionCard({
  title,
  icon: Icon,
  buttonText,
  buttonHref,
  children,
}: DashboardSectionCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-3">
            <Icon className="h-6 w-6 text-gray-700" />
            <span className="text-xl font-semibold">{title}</span>
          </CardTitle>
          <Link href={buttonHref}>
            <Button variant="outline" size="sm">{buttonText}</Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        {children}
      </CardContent>
    </Card>
  )
}