import { useState, type ReactNode } from 'react'

interface AccordionProps {
  triggerContent: ReactNode | string
  children: ReactNode
  defaultOpen?: boolean
}

export default function Accordion({
  triggerContent,
  children,
  defaultOpen = false,
}: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="collapse collapse-arrow bg-base-200">
      <input
        type="checkbox"
        checked={isOpen}
        onChange={() => setIsOpen(!isOpen)}
      />
      <div className="collapse-title text-xl font-medium">{triggerContent}</div>
      <div className="collapse-content">{children}</div>
    </div>
  )
}
