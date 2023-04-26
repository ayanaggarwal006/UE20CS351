import mongoose from "mongoose";
import { Order } from "./order";
import { OrderStatus } from "@rs-tickets/common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface TicketI {
  _id: string;
  title: string;
  price: number;
  isReserved?(): Promise<boolean>;
  version?: number;
}

const TicketSchema = new mongoose.Schema<TicketI>(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

TicketSchema.set("versionKey", "version");
TicketSchema.plugin(updateIfCurrentPlugin);

//statics adds a method to the model

//methods adds a method to the document

TicketSchema.methods.isReserved = async function () {
  //this === the ticket document that we just called 'isReserved' on
  const order = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });

  return !!order;
};

const TicketModel = mongoose.model<TicketI>("Ticket", TicketSchema);

export class Ticket extends TicketModel {
  constructor(attrs: TicketI) {
    super(attrs);
  }
}
