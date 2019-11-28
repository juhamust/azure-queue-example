import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import Container from '@material-ui/core/Container'
import { makeStyles } from '@material-ui/core/styles'
import {
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Button,
  Typography,
} from '@material-ui/core'

interface DataEntry {
  id: string
  value: string
}

const useStyles = makeStyles(theme => ({
  progressBar: {
    height: '20px',
    margin: '2rem 0',
  },
}))

const App: React.FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL || 'notset.com'
  const classes = useStyles()
  const [data, setData] = useState<DataEntry[] | null>([])
  const [completed, setCompleted] = React.useState(0)

  const progress = React.useRef(() => {})
  React.useEffect(() => {
    progress.current = () => {
      if (completed > 100) {
        setCompleted(0)
      } else {
        const diff = Math.random() * 10
        setCompleted(completed + diff)
      }
    }
  })

  React.useEffect(() => {
    function tick() {
      progress.current()
    }
    const timer = setInterval(tick, 500)

    return () => {
      clearInterval(timer)
    }
  }, [])

  const loadData = useCallback(
    async url => {
      const response = await axios({
        url,
        method: 'GET',
      })
      setData(response.data)
    },
    [setData]
  )

  const addTasks = useCallback(
    async url => {
      await axios({
        url,
        method: 'POST',
      })
      loadData(apiUrl)
    },
    [loadData, apiUrl]
  )

  useEffect(() => {
    loadData(apiUrl)
    setInterval(() => {
      loadData(apiUrl)
    }, 10000)
  }, [apiUrl, loadData])

  return (
    <Container>
      <LinearProgress
        className={classes.progressBar}
        variant="buffer"
        value={data && data.length > 0 ? completed : 0}
        valueBuffer={100}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={() => addTasks(apiUrl)}
      >
        Add tasks
      </Button>
      <Typography>
        Currently{' '}
        {data && data.length > 0 ? `${data.length} tasks` : 'no tasks'}
      </Typography>
      <List dense={true}>
        {(data || []).map((entry, index) => {
          return (
            <ListItem key={index}>
              <ListItemText primary={entry} />
            </ListItem>
          )
        })}
      </List>
    </Container>
  )
}

export default App
