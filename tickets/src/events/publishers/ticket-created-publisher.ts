import { Publisher, Subjects, TicketCreatedEvent } from "@rs-tickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
   readonly subject = Subjects.TicketCreated;
}