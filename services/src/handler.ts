const crypto = require('crypto')

export function getSharedAccessToken(uri, saName, saKey) {
  const encoded = encodeURIComponent(uri)
  const now = new Date()
  const hour = 60 * 60
  const ttl = Math.round(now.getTime() / 1000) + hour
  const signature = `${encoded}\n${ttl}`
  const hash = crypto
    .createHmac('sha256', saKey)
    .update(signature)
    .digest('base64')

  return `SharedAccessSignature sr=${encoded}&sig=${encodeURIComponent(
    hash
  )}&se=${ttl}&skn=${saName}`
}

export function doThis() {
  return 'done'
}

export default async function(context: any, mySbMsg: any) {
  context.log(
    'JavaScript ServiceBus queue trigger function processed message',
    mySbMsg.name
  )
  context.log('EnqueuedTimeUtc =', context.bindingData.enqueuedTimeUtc)
  context.log('DeliveryCount =', context.bindingData.deliveryCount)
  context.log('MessageId =', context.bindingData.messageId)
  context.done()
}
