"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card"

interface InfoCardProps {
  title: string
  children: React.ReactNode
  className?: string
}

export function InfoCard({ title, children, className }: InfoCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  )
} 