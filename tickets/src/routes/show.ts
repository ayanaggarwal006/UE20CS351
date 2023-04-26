import express, { Request, Response } from "express";
import mongoose from "mongoose";
import {
  requireAuth,
  validateRequest,
  NotFoundError,
} from "@rs-tickets/common";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";

const router = express.Router();

router.get("/api/tickets/:id", async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(
    new mongoose.Types.ObjectId(req.params.id)
  );

  if (!ticket) {
    throw new NotFoundError();
  }
  res.status(200).send(ticket);
});

export { router as showTicketRouter };
