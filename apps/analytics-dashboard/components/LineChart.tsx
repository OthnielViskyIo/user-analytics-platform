'use client'

import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import {
  useSessionOverTime,
  type Measure,
  type SessionOverTimeMethod,
  type SessionData,
  type MinMaxAvgData,
} from '@/hooks/useSessionsOverTime'

interface LineChartProps {
  title: string
  method: SessionOverTimeMethod
}

export function LineChart({ title, method }: LineChartProps) {
  const [measure, setMeasure] = useState<Measure>('week')
  const { data = [], isLoading, isError } = useSessionOverTime(measure, method)
  const svgRef = useRef<SVGSVGElement>(null)

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

    if (method === 'lttb') {
      const lttbData = data as SessionData[]

      const y = d3
        .scaleLinear()
        .domain([0, d3.max(lttbData, (d) => d.count) || 0])
        .nice()
        .range([height - margin.bottom, margin.top])

      const line = d3
        .line<SessionData>()
        .x((d) => x(d.period)!)
        .y((d) => y(d.count))
        .curve(d3.curveMonotoneX)

      svg
        .append('path')
        .datum(lttbData)
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 2)
        .attr('d', line)

      svg
        .append('g')
        .attr('fill', 'steelblue')
        .selectAll('circle')
        .data(lttbData)
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
    } else {
      const mmData = data as MinMaxAvgData[]

      const y = d3
        .scaleLinear()
        .domain([0, d3.max(mmData, (d) => d.max) || 0])
        .nice()
        .range([height - margin.bottom, margin.top])

      const area = d3
        .area<MinMaxAvgData>()
        .x((d) => x(d.period)!)
        .y0((d) => y(d.min))
        .y1((d) => y(d.max))
        .curve(d3.curveMonotoneX)

      svg
        .append('path')
        .datum(mmData)
        .attr('fill', 'steelblue')
        .attr('fill-opacity', 0.2)
        .attr('d', area)

      const line = d3
        .line<MinMaxAvgData>()
        .x((d) => x(d.period)!)
        .y((d) => y(d.avg))
        .curve(d3.curveMonotoneX)

      svg
        .append('path')
        .datum(mmData)
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 2)
        .attr('d', line)

      svg
        .append('g')
        .attr('fill', 'steelblue')
        .selectAll('circle')
        .data(mmData)
        .join('circle')
        .attr('cx', (d) => x(d.period)!)
        .attr('cy', (d) => y(d.avg))
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
    }
  }, [data, method])

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{title}</h3>
        <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg">
          {(['week', 'month', 'year'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMeasure(m)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                measure === m
                  ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'
              }`}
            >
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 min-h-0 relative">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center text-zinc-400">
            Loading...
          </div>
        ) : isError ? (
          <div className="absolute inset-0 flex items-center justify-center text-red-500">
            Error loading data
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
