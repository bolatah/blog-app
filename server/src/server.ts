import http from "http";
import express from "express";
import logging from "./config/logging";
import config from "./config/config";
import mongoose from "mongoose";
import firebaseAdmin from "firebase-admin";

// const router = express.Router(); a slightly mini app is returned as the other mini apps can be exposed to different middlewares.

const router = express(); // Create a new express application instance like the main app

/** Server Handling */
const httpServer = http.createServer(router);

/** Firebase Admin SDK is a set of server libraries that lets you interact with Firebase*/
let serviceAccountKey = require("./config/serviceAccountKey.json");

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccountKey),
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
router.use((req, res, next) => {
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
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

/** API Access Policies */
router.use((req, res, next) => {
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

/** Routes */

/** Error Handling */
router.use((req, res, next) => {
  const error = new Error("Not Found");
  return res.status(404).json({
    message: error.message,
  });
});

/** Listen for requests */

httpServer.listen(config.server.port, () => {
  logging.info(
    `Server is running on ${config.server.hostname}:${config.server.port}`
  );
});
