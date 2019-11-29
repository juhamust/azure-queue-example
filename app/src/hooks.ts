import { useState, useCallback } from 'react'
import { TaskSeriesData, Tasker } from './interfaces'
import { subSeconds } from 'date-fns'
import axios from 'axios'

let intervalId: number = 0

export function useTasker(apiUrl: string): Tasker {
  const now = new Date()
  const [seriesData, setSeriesData] = useState<TaskSeriesData>([
    { x: subSeconds(now, 40).valueOf(), y: 0 },
    { x: subSeconds(now, 20).valueOf(), y: 0 },
    { x: subSeconds(now, 10).valueOf(), y: 0 },
    { x: subSeconds(now, 0).valueOf(), y: 0 },
  ])

  // Action for loading current tasks
  const loadData = useCallback(async url => {
    const response = await axios({
      url,
      method: 'GET',
    })
    const seriesDataCopy = [...seriesData]
    seriesDataCopy.push({ x: new Date().valueOf(), y: response.data.length })
    // Cap the series data to 10 items
    setSeriesData(
      seriesDataCopy.length > 10
        ? seriesDataCopy.slice(seriesDataCopy.length - 10)
        : seriesDataCopy
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Action for adding tasks
  const addTasks = useCallback(
    async url => {
      await axios({
        url,
        method: 'POST',
      })
      // Reload data
      loadData(apiUrl)
    },
    [loadData, apiUrl]
  )

  // Clear old timer if needed
  if (intervalId) {
    clearInterval(intervalId)
  }

  intervalId = setInterval(async () => {
    await loadData(apiUrl)
  }, 3000)

  return {
    tasks: [],
    seriesData,
    addTasks,
  }
}

export function useTimer(seconds: number) {
  const [timeUp, setTimeUp] = useState(false)
  setTimeout(() => setTimeUp(true), seconds * 1000)

  return {
    timeUp,
  }
}
