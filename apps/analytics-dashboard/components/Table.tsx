import type { ReactNode } from 'react'

type Column<T> = {
  header: string
  accessor: (item: T) => ReactNode
  align?: 'left' | 'right'
}

type TableProps<T> = {
  data: T[]
  columns: Column<T>[]
  keyExtractor: (item: T) => string
}

export function Table<T>({ data, columns, keyExtractor }: TableProps<T>) {
  return (
    <table className="w-full text-left border-collapse">
      <thead>
        <tr>
          {columns.map((column) => (
            <th
              key={column.header}
              className={`sticky top-0 z-10 bg-white dark:bg-zinc-950 py-2 font-semibold border-b border-zinc-200 dark:border-zinc-800 ${
                column.align === 'right' ? 'text-right pr-2' : ''
              }`}
            >
              {column.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={keyExtractor(item)} className="border-b border-zinc-100 dark:border-zinc-900/50">
            {columns.map((column) => (
              <td
                key={column.header}
                className={`py-2 ${column.align === 'right' ? 'text-right pr-2' : ''}`}
              >
                {column.accessor(item)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
