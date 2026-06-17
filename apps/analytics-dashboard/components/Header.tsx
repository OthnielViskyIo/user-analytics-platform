export function Header() {
  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-zinc-200 bg-white px-8 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center gap-4">
        <div className="h-8 w-8 rounded-lg bg-indigo-600"></div>
        <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Analytics Dashboard
        </span>
      </div>
      <div className="flex items-center gap-4">
        <div className="h-8 w-8 rounded-full bg-zinc-200 dark:bg-zinc-800"></div>
      </div>
    </header>
  )
}
