import { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  subtitle?: string
  action?: ReactNode
}

export default function PageHeader({
  title,
  subtitle,
  action,
}: PageHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-4xl font-bold text-base-content">{title}</h1>
        {subtitle && <p className="text-base-content/70 mt-2">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}
