import { Card } from '@/components/Card'
import { Table } from '@/components/Table'
import { LineChart } from '@/components/LineChart'
import { formatPageName, formatTime } from '@/utils/format'
import { getData } from '@/utils/data'

export default async function Home() {
  const data = await getData()

  const pageViews = (data?.pageviews as Record<string, number>) || {}
  const timeOnPage = (data?.timeOnPage as Record<string, number>) || {}

  const sortedPageViews = Object.entries(pageViews).sort((a, b) => b[1] - a[1])
  const sortedTimeOnPage = Object.entries(timeOnPage).sort((a, b) => b[1] - a[1])

  return (
    <div className="min-h-screen bg-zinc-50 p-8 dark:bg-zinc-900/20 w-full">
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
          <LineChart title="Sessions Over Time (LTTB)" method="lttb" />
        </div>
        <div className="flex flex-col rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 h-80">
          <LineChart title="Sessions (Min-Max-Avg)" method="min-max-avg" />
        </div>
      </div>
    </div>
  )
}
