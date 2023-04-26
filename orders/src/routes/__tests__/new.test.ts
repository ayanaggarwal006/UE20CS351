import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Order } from "../../models/order";
import { OrderStatus } from "@rs-tickets/common";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";

it("returns and error if the ticket does not exist", async () => {
  const ticketId = new mongoose.Types.ObjectId();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signup())
    .send({ ticketId })
    .expect(404);
});

it("returns and error if the ticket is already reserved", async () => {
  const ticket = new Ticket({
    _id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  await ticket.save();

  const order = new Order({
    ticket: new mongoose.Types.ObjectId(ticket._id),
    userId: "123",
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });

  await order.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signup())
    .send({ ticketId: ticket._id })
    .expect(400);
});

it("reserves a ticket", async () => {
  const ticket = new Ticket({
    _id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  await ticket.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signup())
    .send({ ticketId: ticket._id })
    .expect(201);
});

it("emits an order created event", async () => {
  const ticket = new Ticket({
    _id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  await ticket.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signup())
    .send({ ticketId: ticket._id })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
