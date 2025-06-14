import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
}

export default function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div
      className={`card bg-base-100 shadow-lg hover:shadow-xl transition-shadow cursor-pointer ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
