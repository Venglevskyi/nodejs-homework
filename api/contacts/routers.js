const { Router } = require("express");
const ContactsOperations = require("./operations");

const contactsRouter = Router();
const contactsRouterByQuery = Router();

contactsRouter.get(
  "/",
  ContactsOperations.listContacts.bind(ContactsOperations)
);
contactsRouter.get("/:id", ContactsOperations.getById.bind(ContactsOperations));
contactsRouter.post(
  "/",
  ContactsOperations.validateContact,
  ContactsOperations.addContact
);
contactsRouter.delete(
  "/:id",
  ContactsOperations.removeContact.bind(ContactsOperations)
);
contactsRouter.patch(
  "/:id",
  ContactsOperations.validateContact,
  ContactsOperations.updateContact.bind(ContactsOperations)
);
contactsRouterByQuery.get(
  "/",
  ContactsOperations.getContactsBySubscription.bind(ContactsOperations)
);

module.exports = { contactsRouter, contactsRouterByQuery };
