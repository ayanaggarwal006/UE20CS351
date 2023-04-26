import { OrderStatus } from "@rs-tickets/common";
import mongoose from "mongoose"
import { updateIfCurrentPlugin } from "mongoose-update-if-current";


interface OrderI {
  _id: string;
  version: number;
  userId: string;
  price: number;
  status: OrderStatus;
  
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
    price: {
      type: Number,
      required: true,
    }
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
