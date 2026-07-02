import { useQuery } from '@tanstack/react-query'

export type Measure = 'week' | 'month' | 'year'
export const SessionOverTimeMethod = {
  LTTB: 'lttb',
  MIN_MAX_AVG: 'min-max-avg',
} as const
export type SessionOverTimeMethod =
  (typeof SessionOverTimeMethod)[keyof typeof SessionOverTimeMethod]

export type SessionData = {
  period: string
  count: number
}

export type MinMaxAvgData = {
  period: string
  min: number
  max: number
  avg: number
}

async function fetchSessionsOverTimeLTTB(measure: Measure): Promise<SessionData[]> {
  const res = await fetch(
    `http://localhost:1351/capture/sessions-over-time-lttb?measure=${measure}`,
  )
  if (!res.ok) {
    throw new Error('Failed to fetch session data (LTTB)')
  }
  return res.json()
}

async function fetchSessionsOverTimeMinMaxAvg(measure: Measure): Promise<MinMaxAvgData[]> {
  const res = await fetch(
    `http://localhost:1351/capture/sessions-over-time-min-max-avg?measure=${measure}`,
  )
  if (!res.ok) {
    throw new Error('Failed to fetch session data (Min-Max-Avg)')
  }
  return res.json()
}

export const useSessionOverTime = (
  measure: Measure = 'week',
  method: SessionOverTimeMethod = 'lttb',
) => {
  const fetcher = method === 'lttb' ? fetchSessionsOverTimeLTTB : fetchSessionsOverTimeMinMaxAvg

  return useQuery<SessionData[] | MinMaxAvgData[]>({
    queryKey: ['sessions-over-time', method, measure],
    queryFn: () => fetcher(measure),
  })
}
