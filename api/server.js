const express = require("express");
const cors = require("cors");
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
    this.startListening();
  }

  initServer() {
    this.server = express();
  }

  initMiddlewares() {
    this.server.use(express.json());
    this.server.use(cors({ origin: "http://localhost:3000" }));
  }

  initRoutes() {
    this.server.use("/api/contacts", contactsRouter);
  }

  startListening() {
    this.server.listen(port, () => {
      console.log("Started listening on port", port);
    });
  }
};
