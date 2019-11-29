import React from 'react'
import Container from '@material-ui/core/Container'
import {
  List,
  ListItem,
  ListItemText,
  Button,
  Typography,
} from '@material-ui/core'
import TaskChart from './TaskChart'
import { useTasker } from './hooks'

const App: React.FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL || 'notset.com'
  const tasker = useTasker(apiUrl)

  return (
    <Container>
      <TaskChart
        series={[
          {
            name: 'test',
            type: 'line',
            data: tasker.seriesData,
          },
        ]}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={() => tasker.addTasks(apiUrl)}
      >
        Add tasks
      </Button>
      <Typography>
        Currently{' '}
        {tasker.tasks && tasker.tasks.length > 0
          ? `${tasker.tasks.length} tasks`
          : 'no tasks'}
      </Typography>
      <List dense={true}>
        {(tasker.tasks || []).map((task, index) => {
          return (
            <ListItem key={index}>
              <ListItemText primary={task} />
            </ListItem>
          )
        })}
      </List>
    </Container>
  )
}

export default App
