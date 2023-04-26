import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from "@rs-tickets/common";


export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}