export function Sidebar() {
  const items = ['Overview', 'Analytics', 'Reports', 'Settings']

  return (
    <aside className="fixed bottom-0 left-0 top-16 w-64 overflow-y-auto border-r border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
      <nav className="flex flex-col gap-2 p-4">
        {items.map((item) => (
          <a
            key={item}
            href="#"
            className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
          >
            {item}
          </a>
        ))}
      </nav>
    </aside>
  )
}
