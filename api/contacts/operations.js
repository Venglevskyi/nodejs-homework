const Joi = require("joi");
const { v4: uuidv4 } = require("uuid");
const contacts = require("../../db/contacts.json");

class ContactsOperations {
  listContacts(req, res, next) {
    try {
      return res.status(200).json(contacts);
    } catch (err) {
      next(err);
    }
  }

  getById(req, res, next) {
    try {
      const { id } = req.params;
      const findContact = this.contactFound(id);

      // if (!contactFound) {
      //   res.status(404).json({ message: "Not found" });
      //   return;
      // }

      return res.status(200).json(findContact);
    } catch (err) {
      next(err);
    }
  }

  addContact(req, res, next) {
    try {
      const newContact = { ...req.body, id: uuidv4() };
      contacts.push(newContact);
      return res.status(201).json(contacts);
    } catch (err) {
      next(err);
    }
  }

  removeContact(req, res, next) {
    try {
      const { id } = req.params;
      const findContact = this.contactFound(id);
      if (!findContact) {
        res.status(404).json({ message: "Not found" });
        return;
      }
      return res.status(200).json({ message: "contact deleted" });
    } catch (err) {
      next(err);
    }
  }

  updateContact(req, res, next) {
    try {
      const { id } = req.params;
      const findContact = this.contactFound(id);
      if (!findContact) {
        res.status(404).json({ message: "Not found" });
        return;
      }
      const updateContact = {
        ...findContact,
        ...req.body,
      };
      res.status(200).json(updateContact);
    } catch (err) {
      next(err);
    }
  }

  validateContact(req, res, next) {
    const contactRules = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
      phone: Joi.string().required(),
    });

    const result = Joi.validate(req.body, contactRules);
    if (result.error) {
      return res.status(400).json({ message: "missing required name field" });
    }
    next();
  }

  contactFound(contactId) {
    const findContact = contacts.find(
      (contact) => contact.id === Number(contactId)
    );
    return findContact;
  }
}

module.exports = new ContactsOperations();
