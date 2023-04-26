import { Publisher, OrderCancelledEvent, Subjects } from "@rs-tickets/common";
import { natsWrapper } from "../../nats-wrapper";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
