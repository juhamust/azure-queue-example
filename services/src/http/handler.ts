import { createHmac } from 'crypto'
import { Context, HttpRequest } from '@azure/functions'
import { ServiceBusClient, QueueClient } from '@azure/service-bus'

let queueClient: QueueClient = null

export function getSharedAccessToken(uri, saName, saKey) {
  const encoded = encodeURIComponent(uri)
  const now = new Date()
  const hour = 60 * 60
  const ttl = Math.round(now.getTime() / 1000) + hour
  const signature = `${encoded}\n${ttl}`
  const hash = createHmac('sha256', saKey)
    .update(signature)
    .digest('base64')

  return `SharedAccessSignature sr=${encoded}&sig=${encodeURIComponent(
    hash
  )}&se=${ttl}&skn=${saName}`
}

function getQueueClient(): QueueClient {
  if (queueClient) {
    return queueClient
  }
  return ServiceBusClient.createFromConnectionString(
    process.env.QUEUE_CONNECTION_STRING
  ).createQueueClient(process.env.QUEUE_NAME)
}

export async function addItem() {
  const sender = getQueueClient().createSender()
  const generateItems = (count: number) => {
    const items = []
    for (let index = 0; index < count; index++) {
      items.push({ body: `time: ${new Date().valueOf()}` })
    }
    return items
  }

  // NOTE: To send one, use sender.send({ body: 'foo' })
  // Generate items to task queue
  await sender.sendBatch(generateItems(100))
}

export async function getItems(
  client: QueueClient,
  pageLimit: number = 250
): Promise<any[]> {
  let items = []

  const getBatch = async () => {
    // NOTE: Peek has internal limit of 250
    const messages = await client.peek(pageLimit)
    return messages.map(message => {
      return { text: message.body, meta: message }
    })
  }

  // Iterate until we have all the messages
  while (true) {
    const batch = await getBatch()
    items = items.concat(batch)

    if (batch.length < pageLimit) {
      break
    }
  }

  return items
}

export async function handle(context: Context, req: HttpRequest) {
  context.log(
    'Node.js HTTP trigger function processed a request. RequestUri=%s',
    req.method
  )

  // Insert new item
  if (req.method === 'POST') {
    await addItem()
    return {
      body: JSON.stringify({ message: 'ok' }),
      headers: {
        'Content-Type': 'application/json',
      },
      isRaw: true,
    }
  }

  // Return listing
  const client = await getQueueClient()
  const items = await getItems(client)
  return {
    body: JSON.stringify(items),
    headers: {
      'Content-Type': 'application/json',
    },
    isRaw: true,
  }
}
