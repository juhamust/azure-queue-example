import React, { createRef, useEffect, useState } from 'react'
import styled from 'styled-components'
import * as Highcharts from 'highcharts'
import { format } from 'date-fns'
import { TaskSeriesEntry } from './interfaces'
const HighchartsMore = require('highcharts/highcharts-more')

HighchartsMore(Highcharts)

export function normalizeValue(
  inputValue: number | null,
  averageValue: number
) {
  if (inputValue === null) {
    return null
  }
  return (inputValue - averageValue / 2) * 100
}

export function getTimestamp(rawValue: Date | number) {
  if (rawValue === null) {
    return null
  }
  return parseInt(format(rawValue, 'x'), 10)
}

const ChartContainer = styled.div`
  height: 400px;
  width: 100%;
`

type Props = {
  series: TaskSeriesEntry[]
}

const TaskChart = (props: Props) => {
  const [chart, setChart] = useState()
  const [lastPoint, setLastPoint] = useState(0)

  const containerElement = createRef<any>()
  useEffect(() => {
    const taskChart = Highcharts.chart(containerElement.current, {
      chart: {
        zoomType: 'xy',
        type: 'line',
      },
      plotOptions: {
        series: {
          marker: {
            radius: 5,
          },
          dataLabels: {
            enabled: false,
            borderRadius: 2,
            y: 10,
            x: 20,
            shape: 'callout',
          },
        },
        line: {
          states: {
            hover: {
              enabled: true,
            },
          },
        },
      },
      title: {
        text: '',
      },
      subtitle: {
        text: 'Water',
      },
      xAxis: [
        {
          type: 'datetime',
        },
      ] as any,
      yAxis: [
        {
          title: {
            text: 'Level',
          },
        },
      ],
      tooltip: {
        shared: true,
        valueDecimals: 2,
      },
      series: props.series,
      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 500,
            },
            chartOptions: {
              legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom',
              },
            },
          },
        ],
      },
    })
    setChart(taskChart)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    // Take that last data point
    const updatedDataPoint =
      props.series && props.series.length > 0
        ? props.series[0].data[props.series[0].data.length - 1].x
        : 0
    if (chart && lastPoint !== updatedDataPoint) {
      chart.update({
        series: props.series,
      })
      setLastPoint(updatedDataPoint)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.series, chart, lastPoint])

  return (
    <div>
      <ChartContainer ref={containerElement} />
    </div>
  )
}

export default TaskChart
