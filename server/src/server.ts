import http from "http";
import express from "express";
import dotenv from "dotenv";

import mongoose from "mongoose";
import firebaseAdmin from "firebase-admin";

import userRoutes from "./routes/user";
import blogRoutes from "./routes/blog";
import logging from "./config/logging";
import config from "./config/config";

dotenv.config();

// const app = express.Router(); a slightly mini app is returned as the other mini apps can be exposed to different middlewares.

const app = express(); // Create a new express application instance like the main app

/** Server Handling */
const httpServer = http.createServer(app);

/** Firebase Admin SDK is a set of server libraries that lets you interact with Firebase*/

//let serviceAccountKey = require("./config/serviceAccountKey.json");

const firebaseAdminConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(firebaseAdminConfig),
});

/** MongoDB Connection */
mongoose
  .connect(config.mongo.url, config.mongo.options)
  .then(() => {
    logging.info("MongoDB Connected");
  })
  .catch((error) => {
    logging.error(error);
  });

/** Logging Express Middlewares */
app.use((req, res, next) => {
  logging.info(
    `METHOD: '${req.method}' - URL : '${req.url}' -IP: '${req.socket.remoteAddress}'`
  );
  res.on("finish", () => {
    logging.info(
      `METHOD: '${req.method}' - URL : '${req.url}' -IP: '${req.socket.remoteAddress}' - STATUS: ${res.statusCode}`
    );
  });
  next();
});

/** Parsing the body */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/** API Access Policies */
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

// serve static assets if in production
app.use(express.static("public"));

/** Routes */
app.use("/users", userRoutes);
app.use("/blogs", blogRoutes);

// Redirecting to root
app.use((req, res, next) => {
  res.redirect("/");
});

/** Listen for requests */
const port = process.env.PORT || 8000;

httpServer.listen(port, () => {
  logging.info(`Server is running on ${config.server.hostname}:${port}`);
});
