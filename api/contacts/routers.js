const { Router } = require("express");
const ContactsOperations = require("./operations");

const contactsRouter = Router();

contactsRouter.get("/", (req, res, next) => res.send("Hello world"));

module.exports = contactsRouter;
