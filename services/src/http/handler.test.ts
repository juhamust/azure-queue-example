import { getSharedAccessToken, getItems } from './handler'
import { QueueClient, ServiceBusClient } from '@azure/service-bus'

it('generates shared access token', () => {
  const token = getSharedAccessToken(
    'https://mybus.servicebus.windows.net/myqueue',
    'name',
    'abc'
  )
  expect(token).toBeDefined()
})

it('returns batches', async () => {
  const peekMock = jest.fn()

  const queueClient = ServiceBusClient.createFromConnectionString(
    'Endpoint=sb://test.servicebus.windows.net/;SharedAccessKeyName=ReadWrite;SharedAccessKey=test'
  ).createQueueClient('test')

  peekMock
    .mockReturnValueOnce([{ body: 'a' }])
    .mockReturnValueOnce([{ body: 'b' }])
    .mockReturnValueOnce([{ body: 'c' }])
    .mockReturnValue([])

  queueClient.peek = peekMock
  const items = await getItems(queueClient, 1)
  expect(items).toHaveLength(3)
})
