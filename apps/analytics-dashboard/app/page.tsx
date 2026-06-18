import { Card } from '@/components/Card'
import { formatPageName, formatTime } from '@/utils/format'
import { getData } from '@/utils/data'

export default async function Home() {
  const data = await getData()

  const pageViews = (data?.pageviews as Record<string, number>) || {}
  const timeOnPage = (data?.timeOnPage as Record<string, number>) || {}

  const lorem =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'

  return (
    <div className="min-h-screen bg-zinc-50 p-8 dark:bg-zinc-900/20">
      <div className="grid grid-cols-2 gap-8">
        <Card title="Page Views">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800">
                <th className="py-2 font-semibold">Page</th>
                <th className="py-2 font-semibold text-right">Visits</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(pageViews)
                .sort((a, b) => b[1] - a[1])
                .map(([page, visits]) => (
                  <tr key={page} className="border-b border-zinc-100 dark:border-zinc-900/50">
                    <td className="py-2">{formatPageName(page)}</td>
                    <td className="py-2 text-right">{visits}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </Card>
        <Card title="Time on Page">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800">
                <th className="py-2 font-semibold">Page</th>
                <th className="py-2 font-semibold text-right">Time on page</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(timeOnPage)
                .sort((a, b) => b[1] - a[1])
                .map(([page, time]) => (
                  <tr key={page} className="border-b border-zinc-100 dark:border-zinc-900/50">
                    <td className="py-2">{formatPageName(page)}</td>
                    <td className="py-2 text-right">{formatTime(time)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </Card>
        <Card title="Retention Rate">
          <p>{lorem}</p>
        </Card>
        <Card title="Churn Rate">
          <p>{lorem}</p>
        </Card>
      </div>
    </div>
  )
}
