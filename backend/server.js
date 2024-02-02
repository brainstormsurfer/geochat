import express from "express";
import 'express-async-errors'
import dotenv from "dotenv";

dotenv.config();
const app = express();

import { logger, logEvents } from "./src/middleware/logger.js";

import cors from "cors";
// import { corsOptions } from "./config/corsOptions.js";

import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";

import colors from "colors";

import { configureXssMiddleware } from "./src/middleware/configureXssMiddleware.js";

import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import hpp from "hpp";

import fileUpload from "express-fileupload";
import connectDB from "./config/dbConn.js";
import mongoose from "mongoose";
import { verifyJWT } from "./src/middleware/verifyJWT.js";

import {
  rootRouter, 
  registerRouter,
  guestRouter, 
  forgotPwdRouter 
  } from './src/routes/index.js'

import authRouter from "./src/routes/auth.js";
import usersRouter from "./src/routes/api/users.js";
import helpersRouter from "./src/routes/api/helpers.js";
import eventsRouter from "./src/routes/api/events.js";
import feedbacksRouter from "./src/routes/api/feedbacks.js";

import errorHandler from "./src/middleware/errorHandler.js";

import apiPrefixMiddleware from "./src/middleware/apiPrefixMiddleware.js";
// import rootRouter from './src/routes/root.js';
// import registerRouter from './src/routes/register.js';
// import forgotPwdRouter from './src/routes/forgotPwd.js';
// import guestRouter from './src/routes/guest.js';
// import authRouter from './src/routes/auth.js';
// import usersRouter from './src/routes/api/users.js';


// import apiPrefixMiddleware from "./src/middleware/apiPrefixMiddleware.js";

// Connect to database
connectDB()

// custom middleware logger
app.use(logger);


// Cross Origin Resource Sharing
// app.use(cors(corsOptions));
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// File uploading (such as a photo for a helper)
app.use(fileUpload());

// Prevent XSS attacks
app.use(configureXssMiddleware());

// Sanitize Data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent http param pollution
app.use(hpp());


// app.use(apiPrefixMiddleware); 
// Set static folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));

// app.use("/", rootRouter);

app.use('/', rootRouter);

// app.use("/api/v1", rootRouter) 
app.use("/auth", authRouter); //: login, logout, refreshToken

app.use("/register", registerRouter);
app.use('/forgot', forgotPwdRouter);
app.use('/guest', guestRouter);

// app.use(verifyJWT);
app.use("/users", usersRouter);
app.use("/helpers", helpersRouter);
app.use("/events", eventsRouter);
app.use("/feedbacks", feedbacksRouter);

const PORT = process.env.PORT || 5000;

// if (process.env.NODE_ENV === "production") {
//   app.all("*", (req, res) => {
//     res.status(404);
//     if (req.accepts("html")) {
//       res.sendFile(path.join(__dirname, "views", "404.html"));
//     } else if (req.accepts("json")) {
//       res.json({ message: "404 Not Found" });
//     } else {
//       res.type("txt").send("404 Not Found");
//     }
//   });
// }

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`.yellow.bold));
});

mongoose.connection.on('error', err => {
  console.log(err)
  logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})

