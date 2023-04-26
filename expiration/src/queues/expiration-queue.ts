import Queue from "bull";
import { ExpirationCompletePublisher } from "../events/publishers/expiration-completed-publisher";
import { natsWrapper } from "../nats-wrapper";


interface Payload {
  orderId: string;
}

//payload will be used to figure out what info we want to process while adding and removing jobs from the queue
const expirationQueue = new Queue<Payload>("order:expiration", {
  redis: {
    host: process.env.REDIS_HOST
  }
})

//process the job
expirationQueue.process(async (job) => {
  //publish an event that the order has expired
  new ExpirationCompletePublisher(natsWrapper.client).publish({
    orderId: job.data.orderId
  })
})

export { expirationQueue };