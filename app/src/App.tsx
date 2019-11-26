import React, { useState, useEffect, useCallback } from 'react'

interface DataEntry {
  id: string
  value: string
}

const App: React.FC = () => {
  const [data, setData] = useState<DataEntry[] | null>([])

  const loadData = useCallback(() => {
    // TODO: Implement
    setData([{ id: 'abc', value: 'dang' }])
  }, [])

  useEffect(() => {
    loadData()
  })

  return (
    <div className="App">
      <header className="App-header">Works!</header>
      <ul>
        {(data || []).map(entry => (
          <li>
            {entry.id}: {entry.value}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
