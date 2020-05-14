const Joi = require("@hapi/joi");
const ContactModel = require("./model");
const NotFoundError = require("../helpers/errors.constructors");

class ContactsOperations {
  async listContacts(req, res, next) {
    try {
      const allContacts = await ContactModel.getAllContacts();
      return res.status(200).json(allContacts);
    } catch (err) {
      next(err);
    }
  }

  async getContactsWithPagination(req, res, next) {
    try {
      const { page, limit } = req.query;
      const contactsWithQuery = await ContactModel.paginate(
        {},
        { page, limit }
      );
      return res.status(200).json(contactsWithQuery.docs);
    } catch (err) {
      next(err);
    }
  }

  async getContactsBySubscription(req, res, next) {
    try {
      const findUserBySub = await ContactModel.findContactsBySubscription(
        req.query.sub
      );
      return res.status(200).json(findUserBySub);
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const findContact = await this.contactFound(id);
      return res.status(200).json(findContact);
    } catch (err) {
      next(err);
    }
  }

  async addContact(req, res, next) {
    try {
      const newContact = await ContactModel.addContactOnDb(req.body);
      return res.status(201).json(newContact);
    } catch (err) {
      next(err);
    }
  }

  async removeContact(req, res, next) {
    try {
      const { id } = req.params;
      await this.contactFound(id);
      await ContactModel.removeContactById(id);
      return res.status(200).send({ message: "contact deleted" });
    } catch (err) {
      next(err);
    }
  }

  async updateContact(req, res, next) {
    try {
      const { id } = req.params;
      await this.contactFound(id);
      const updatedContact = await ContactModel.updateContactById(id, req.body);
      res.status(200).json(updatedContact.value);
    } catch (err) {
      next(err);
    }
  }

  validateContact(req, res, next) {
    const contactRules = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
      phone: Joi.string().required(),
      subscription: Joi.string(),
    });

    const result = contactRules.validate(req.body);
    if (result.error) {
      return res.status(400).json({ message: "missing required name field" });
    }
    next();
  }

  async contactFound(contactId) {
    const findContact = await ContactModel.getContactById(contactId);
    if (!findContact) {
      throw new NotFoundError("User not found");
    }
    return findContact;
  }
}

module.exports = new ContactsOperations();
