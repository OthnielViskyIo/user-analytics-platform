import { Card } from '@/components/Card'
import { Table } from '@/components/Table'
import { SessionsOverTimeChart } from '@/components/SessionsOverTimeChart'
import { formatPageName, formatTime } from '@/utils/format'
import { getData } from '@/utils/data'

export default async function Home() {
  const data = await getData()

  const pageViews = (data?.pageviews as Record<string, number>) || {}
  const timeOnPage = (data?.timeOnPage as Record<string, number>) || {}

  const sortedPageViews = Object.entries(pageViews).sort((a, b) => b[1] - a[1])
  const sortedTimeOnPage = Object.entries(timeOnPage).sort((a, b) => b[1] - a[1])

  const lorem =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'

  return (
    <div className="min-h-screen bg-zinc-50 p-8 dark:bg-zinc-900/20">
      <div className="grid grid-cols-2 gap-8">
        <Card title="Page Views">
          <Table
            data={sortedPageViews}
            keyExtractor={([page]) => page}
            columns={[
              { header: 'Page', accessor: ([page]) => formatPageName(page) },
              { header: 'Visits', accessor: ([, visits]) => visits, align: 'right' },
            ]}
          />
        </Card>
        <Card title="Time on Page">
          <Table
            data={sortedTimeOnPage}
            keyExtractor={([page]) => page}
            columns={[
              { header: 'Page', accessor: ([page]) => formatPageName(page) },
              { header: 'Time on page', accessor: ([, time]) => formatTime(time), align: 'right' },
            ]}
          />
        </Card>
        <div className="flex flex-col rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 h-80">
          <SessionsOverTimeChart />
        </div>
        <Card title="Churn Rate">
          <p>{lorem}</p>
        </Card>
      </div>
    </div>
  )
}
