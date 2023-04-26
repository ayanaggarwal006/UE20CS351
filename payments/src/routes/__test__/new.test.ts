import request from "supertest";

import { app } from "../../app";
import mongoose from "mongoose";
import { Order } from "../../models/order";
import { OrderStatus } from "@rs-tickets/common";

jest.mock("../../stripe");

it("returns a 404 when purchasing an order that does not exist", async () => {
  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signup())
    .send({
      token: "asdf",
      orderId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it("returns a 401 when purchasing an order that does not belong to the user", async () => {

  const order = new Order({
    _id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    userId: new mongoose.Types.ObjectId().toHexString(),
    price: 20,
    status: OrderStatus.Created,
  });

  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signup())
    .send({
      token: "asdf",
      orderId: order.id,
    })
    .expect(401);
});

