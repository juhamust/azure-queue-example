import { Context } from '@azure/functions'

async function sleep(seconds: number) {
  return new Promise(resolve => {
    setTimeout(() => resolve(), seconds * 1000)
  })
}

export async function handle(context: Context, task: any) {
  context.log('Started task:', task)
  await sleep(10)
  context.log('Task done.')

  context.done()
}
