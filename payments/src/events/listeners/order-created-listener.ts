import { Listener, OrderCreatedEvent, Subjects } from "@rs-tickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";


export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated= Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  onMessage(data: OrderCreatedEvent["data"], msg: Message) {


    const order = new Order({
      _id: data.id,
      version: data.version,
      userId: data.userId,
      price: data.ticket.price,
      status: data.status,
    });
    order.save();

    msg.ack();
  }
}