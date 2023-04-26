import express, { Request, Response } from "express";
import {
  BadRequestError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@rs-tickets/common";
import { OrderStatus } from "@rs-tickets/common";
import { body } from "express-validator";
import { Order } from "../models/order";
import { Ticket } from "../models/ticket";
import mongoose from "mongoose";
import { OrderCreatedPublisher } from "../events/publishers/order-created-pub";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 1 * 60;

router.post(
  "/api/orders",
  requireAuth,
  [body("ticketId").notEmpty().isMongoId()],
  validateRequest,
  async (req: Request, res: Response) => {
    // Find the ticket the user is trying to order in the database
    const { ticketId } = req.body;

    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      throw new NotFoundError();
    }

    // Make sure that this ticket is not already reserved
    // Run query to look at all orders. Find an order where the ticket
    // is the ticket we just found *and* the orders status is *not* cancelled.

    if (ticket.isReserved) {
      const isReserved = await ticket.isReserved();

      if (isReserved) {
        throw new BadRequestError("Ticket is already reserved");
      }

      // Calculate an expiration date for this order

      const expiration = new Date();
      expiration.setSeconds(
        expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS
      );

      // Build the order and save it to the database
      const tid = new mongoose.Types.ObjectId(ticketId);

      const order = new Order({
        userId: req.currentUser!.id,
        status: OrderStatus.Created,
        expiresAt: expiration,
        ticket: tid,
      });

      await order.save();

      // Publish an event saying that an order was created
      if (typeof order.version == "undefined") {
        throw new Error("Order version is undefined");
      }

      await new OrderCreatedPublisher(natsWrapper.client).publish({
        id: order.id,
        status: order.status,
        userId: order.userId,
        version: order.version,
        expiresAt: order.expiresAt.toISOString(),
        ticket: {
          id: ticket.id,
          price: ticket.price,
        },
      });

      res.status(201).send(order);
    }
  }
);

export { router as newOrderRouter };
