export function doThis() {
  return "done";
}

export default async function(context: any, mySbMsg: any) {
  context.log(
    "JavaScript ServiceBus queue trigger function processed message",
    mySbMsg.name
  );
  context.log("EnqueuedTimeUtc =", context.bindingData.enqueuedTimeUtc);
  context.log("DeliveryCount =", context.bindingData.deliveryCount);
  context.log("MessageId =", context.bindingData.messageId);
  context.done();
}
