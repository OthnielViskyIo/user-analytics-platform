'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Header() {
  const pathname = usePathname()

  const getClassName = (path: string) => {
    return pathname === path ? 'font-bold' : 'hover:text-zinc-600 dark:hover:text-zinc-400'
  }

  return (
    <header className="h-24 flex items-center border-b border-zinc-200 dark:border-zinc-800">
      <div className="container mx-auto px-4 max-w-7xl">
        <nav className="flex gap-2">
          <Link href="/" className={`w-24 flex justify-center ${getClassName('/')}`}>
            Home
          </Link>
          <Link href="/profile" className={`w-24 flex justify-center ${getClassName('/profile')}`}>
            Profile
          </Link>
          <Link href="/faq" className={`w-24 flex justify-center ${getClassName('/faq')}`}>
            Faq
          </Link>
        </nav>
      </div>
    </header>
  )
}
