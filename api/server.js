const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();
const port = process.env.PORT;

const contactsRouter = require("./contacts/routers");

module.exports = class ContactsServer {
  constructor() {
    this.server = null;
  }

  start() {
    this.initServer();
    this.initMiddlewares();
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
