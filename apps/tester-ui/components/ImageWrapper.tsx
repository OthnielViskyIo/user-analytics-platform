import { PropsWithChildren } from 'react'

export function ImageWrapper({ children }: PropsWithChildren) {
  return (
    <div className="relative aspect-video overflow-hidden rounded-lg transition-all duration-300 hover:scale-[1.03] hover:shadow-md cursor-pointer">
      {children}
    </div>
  )
}
