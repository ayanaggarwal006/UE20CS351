import { OrderCreatedEvent, Publisher, Subjects } from "@rs-tickets/common";
import { natsWrapper } from "../../nats-wrapper";


export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
