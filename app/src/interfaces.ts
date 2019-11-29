export interface Tasker {
  seriesData: TaskSeriesData
  tasks: string[]
  addTasks: (url: string) => Promise<void>
}

export interface DataEntry {
  text: string
  meta: any
}

export interface TaskSeriesDataEntry {
  x: number
  y: number
}

export interface TaskSeriesData extends Array<TaskSeriesDataEntry> {}

export interface TaskSeriesEntry {
  name: string
  type: 'line'
  data: TaskSeriesDataEntry[]
}
