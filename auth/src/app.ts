import express from "express";
import "express-async-errors";
import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import { errorHandler } from "@rs-tickets/common";
import { NotFoundError } from "@rs-tickets/common";
import cookieSession from "cookie-session";

export const app = express();

app.set("trust proxy", true); // trust ingress-nginx
app.use(express.json());

app.use(
  cookieSession({
    signed: false, // disable encryption
    secure: process.env.NODE_ENV !== "test", // only use cookies over https
  })
);

app.use(currentUserRouter);
app.use(signupRouter);
app.use(signinRouter);
app.use(signoutRouter);

// app.all("*", () => {
//   throw new NotFoundError();
// });
app.all("*", async (req, res, next) => {
  throw new NotFoundError();
});

app.use(errorHandler);
