import { OrderStatus } from "@rs-tickets/common";
import mongoose, { Types } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface OrderI {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  //ticket ref
  ticket: Types.ObjectId;
  version?: number;
}

const OrderSchema = new mongoose.Schema<OrderI>(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
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

OrderSchema.set("versionKey", "version");
OrderSchema.plugin(updateIfCurrentPlugin);

const OrderModel = mongoose.model<OrderI>("Order", OrderSchema);

export class Order extends OrderModel {
  constructor(attrs: OrderI) {
    super(attrs);
  }
}
