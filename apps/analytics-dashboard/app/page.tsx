import { Card } from '@/components/Card'

export default function Home() {
  const lorem =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'

  return (
    <div className="min-h-screen bg-zinc-50 p-8 dark:bg-zinc-900/20">
      <div className="grid grid-cols-2 gap-8">
        <Card title="Revenue">
          <p>{lorem}</p>
        </Card>
        <Card title="Active Users">
          <p>{lorem}</p>
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
