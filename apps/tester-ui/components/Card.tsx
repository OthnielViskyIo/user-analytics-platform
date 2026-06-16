import { ReactNode } from 'react'

export function Card({ children }: { children: ReactNode }) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-sm p-8 min-h-100">
      {children}
    </div>
  )
}
