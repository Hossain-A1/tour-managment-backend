import "./app/config/passpost";
import express, { Request, Response } from "express";
import expressSession from "express-session";
import cors from "cors";
import { router } from "./app/routes";
import { globalErrorHandler } from "./app/middlewares/globalError.middleware";
import { notFoundErrorHandler } from "./app/middlewares/notFound";
import cookieParser from "cookie-parser";
import passport from "passport";
import { envVars } from "./app/config/env";

const app = express();

//required middlewares
app.use(
  expressSession({
    secret: envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

//bypass all routes
app.use("/api/v1", router);

//test route
app.get("/", (req: Request, res: Response) => {
  res
    .status(200)
    .json({ message: "Welcome to Tour management system backend" });
});

app.use(globalErrorHandler);
app.use(notFoundErrorHandler);

export default app;
