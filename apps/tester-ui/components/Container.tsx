import { ReactNode } from 'react';

export function Container({ children }: { children: ReactNode }) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {children}
    </div>
  );
}
