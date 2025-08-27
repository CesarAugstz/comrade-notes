import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  subtitle?: string
  action?: ReactNode
  backButton?: ReactNode
}

export default function PageHeader({
  title,
  subtitle,
  action,
  backButton,
}: PageHeaderProps) {
  return (
    <div className="bg-base-200 rounded-box mb-8">
      <div className="p-6 lg:p-8">
        {backButton && <div className="mb-4">{backButton}</div>}

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl lg:text-4xl font-bold text-base-content mb-2">
              {title}
            </h1>
            {subtitle && (
              <p className="text-base lg:text-lg text-base-content/70">
                {subtitle}
              </p>
            )}
          </div>

          {action && (
            <div className="flex-shrink-0 self-start lg:self-center">
              {action}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
