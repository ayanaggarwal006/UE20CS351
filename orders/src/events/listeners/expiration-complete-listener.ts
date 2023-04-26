import {
  Listener,
  Subjects,
  ExpirationCompleteEvent,
  OrderStatus,
} from "@rs-tickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-names";
import { Order } from "../../models/order";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-pub";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  queueGroupName = queueGroupName;

  async onMessage(data: ExpirationCompleteEvent["data"], msg: Message) {
    const order = await Order.findById(data.orderId).populate("ticket");

    if (!order) {
      throw new Error("Order not found");
    }

    if (order.status === OrderStatus.Complete) {
      return msg.ack();
    }

    order.set({
      status: OrderStatus.Cancelled,
    });

    await order.save();

    //publish an event that the order has been cancelled

    if (typeof order.version === "undefined")
      throw new Error("Order version is undefined");
    new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id.toString(),
      },
    });

    msg.ack();
  }
}
