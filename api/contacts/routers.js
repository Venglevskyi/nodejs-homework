const { Router } = require("express");
const ContactsOperations = require("./operations");

const contactsRouter = Router();

contactsRouter.get("/", ContactsOperations.listContacts);
contactsRouter.get("/:id", ContactsOperations.getById);
contactsRouter.post(
  "/",
  ContactsOperations.validateContact,
  ContactsOperations.addContact
);
contactsRouter.delete("/:id", ContactsOperations.removeContact);
contactsRouter.patch(
  "/:id",
  ContactsOperations.validateContact,
  ContactsOperations.updateContact
);

module.exports = contactsRouter;
