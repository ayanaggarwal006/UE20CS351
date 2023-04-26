import express from "express";
import "express-async-errors";
import { NotFoundError, currentUser, errorHandler } from "@rs-tickets/common";
import cookieSession from "cookie-session";
import { indexOrderRouter } from "./routes";
import { deleteOrderRouter } from "./routes/delete";
import { newOrderRouter } from "./routes/new";
import { showOrderRouter } from "./routes/show";

export const app = express();

app.set("trust proxy", true); // trust ingress-nginx
app.use(express.json());

app.use(
  cookieSession({
    signed: false, // disable encryption
    secure: process.env.NODE_ENV !== "test", // only use cookies over https
  })
);

// to add currentUser middleware to all routes
app.use(currentUser);

app.use(indexOrderRouter);
app.use(deleteOrderRouter);
app.use(newOrderRouter);
app.use(showOrderRouter);

// app.all("*", () => {
//   throw new NotFoundError();
// });
app.all("*", async (req, res, next) => {
  throw new NotFoundError();
});

app.use(errorHandler);
