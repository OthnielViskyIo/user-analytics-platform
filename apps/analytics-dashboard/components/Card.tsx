import type { ReactNode } from 'react'

interface CardProps {
  title: string
  children: ReactNode
}

export function Card({ title, children }: CardProps) {
  return (
    <div className="flex flex-col rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 h-80">
      <h3 className="mb-4 text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        {title}
      </h3>
      <div className="flex-1 overflow-auto text-sm text-zinc-500 dark:text-zinc-400">
        {children}
      </div>
    </div>
  )
}
