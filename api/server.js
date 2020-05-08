const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
require("dotenv").config();

const port = process.env.PORT;
const MongoDB_URL = process.env.MONGODB_URL;

const contactsRouter = require("./contacts/routers");

module.exports = class ContactsServer {
  constructor() {
    this.server = null;
  }

  async start() {
    this.initServer();
    this.initMiddlewares();
    await this.initDatabase();
    this.initRoutes();
    this.handleErrors();
    this.startListening();
  }

  initServer() {
    this.server = express();
  }

  initMiddlewares() {
    this.server.use(express.json());
    this.server.use(cors({ origin: "http://localhost:3000" }));
    this.server.use(morgan("tiny"));
  }

  async initDatabase() {
    try {
      await mongoose.connect(MongoDB_URL, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
      });
      console.log("Database connection successful");
    } catch (err) {
      console.log("MongoDB connection error", err);
      process.exit(1);
    }
  }

  initRoutes() {
    this.server.use("/api/contacts", contactsRouter);
  }

  handleErrors() {
    this.server.use((err, req, res, next) => {
      delete err.stack;
      return res.status(err.status).send(`${err.name}: ${err.message}`);
    });
  }

  startListening() {
    this.server.listen(port, () => {
      console.log("Started listening on port", port);
    });
  }
};
