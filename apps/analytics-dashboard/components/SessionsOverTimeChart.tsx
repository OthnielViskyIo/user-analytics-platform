'use client'

import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'

type Measure = 'week' | 'month' | 'year'

interface SessionData {
  period: string
  count: number
}

export function SessionsOverTimeChart() {
  const [measure, setMeasure] = useState<Measure>('week')
  const [data, setData] = useState<SessionData[]>([])
  const [loading, setLoading] = useState(true)
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const res = await fetch(
          `http://localhost:1351/capture/sessions-over-time?measure=${measure}`,
        )
        if (res.ok) {
          const json = await res.json()
          setData(json)
        }
      } catch (err) {
        console.error('Failed to fetch session data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [measure])

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const width = svgRef.current.parentElement?.clientWidth || 400
    const height = svgRef.current.parentElement?.clientHeight || 200
    const margin = { top: 20, right: 20, bottom: 60, left: 40 }

    const x = d3
      .scalePoint()
      .domain(data.map((d) => d.period))
      .range([margin.left, width - margin.right])

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.count) || 0])
      .nice()
      .range([height - margin.bottom, margin.top])

    const line = d3
      .line<SessionData>()
      .x((d) => x(d.period)!)
      .y((d) => y(d.count))
      .curve(d3.curveMonotoneX)

    svg
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 2)
      .attr('d', line)

    svg
      .append('g')
      .attr('fill', 'steelblue')
      .selectAll('circle')
      .data(data)
      .join('circle')
      .attr('cx', (d) => x(d.period)!)
      .attr('cy', (d) => y(d.count))
      .attr('r', 3)

    svg
      .append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickSizeOuter(0))
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-45)')

    svg.append('g').attr('transform', `translate(${margin.left},0)`).call(d3.axisLeft(y).ticks(5))
  }, [data])

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <h3 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 mb-2">
          Unique Sessions
        </h3>
        <div className="flex gap-2">
          {(['week', 'month', 'year'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMeasure(m)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                measure === m
                  ? 'bg-zinc-900 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700'
              }`}
            >
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 min-h-0 relative">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center text-zinc-400">
            Loading...
          </div>
        ) : data.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center text-zinc-400">
            No data available
          </div>
        ) : (
          <svg ref={svgRef} className="w-full h-full" />
        )}
      </div>
    </div>
  )
}
