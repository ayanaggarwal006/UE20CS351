import mongoose from "mongoose";

interface PaymentI{
  orderId: string;
  stripeId: string;

}

const PaymentSchema = new mongoose.Schema<PaymentI>({
  orderId: {
    type: String,
    required: true,
  },
  stripeId: {
    type: String,
    required: true
  },
},{
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
    }
  }
});

const PaymentModel = mongoose.model<PaymentI>("Payment", PaymentSchema);

export class Payment extends PaymentModel {
  constructor(attrs: PaymentI) {
    super(attrs);
  }
}
