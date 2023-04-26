import { Publisher, Subjects, TicketUpdatedEvent } from "@rs-tickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
   readonly subject = Subjects.TicketUpdated;
}