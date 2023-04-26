import { Listener, Subjects, TicketCreatedEvent } from "@rs-tickets/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-names";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    const { title, price, id } = data;

    const ticket = new Ticket({_id: id, title, price });

    await ticket.save();

    msg.ack();
  }
}
