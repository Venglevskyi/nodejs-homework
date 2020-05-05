const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();
const MongoDB_URL = process.env.MONGODB_URL;
const DB_NAME = process.env.DB_NAME;

class ContactModel {
  constructor() {
    this.contacts = null;
  }

  async getAllContacts() {
    await this.getContactsCollection();
    return this.contacts.find().toArray();
  }

  async addContactOnDb(contactData) {
    await this.getContactsCollection();
    const searchId = await this.contacts.insertOne(contactData);

    return this.contacts.findOne({ _id: new ObjectId(searchId.insertedId) });
  }

  async getContactById(contactId) {
    await this.getContactsCollection();
    if (!ObjectId.isValid(contactId)) {
      return null;
    }

    console.log("id", id);

    return this.contacts.findOne({ _id: new ObjectId(contactId) });
  }

  async updateContactById(contactId, contactData) {
    await this.getContactsCollection();
    if (!ObjectId.isValid(contactId)) {
      return null;
    }

    return this.contacts.findOneAndUpdate(
      { _id: new ObjectId(contactId) },
      { $set: contactData },
      { new: true }
    );
  }

  async removeContactById(contactId) {
    await this.getContactsCollection();
    if (!ObjectId.isValid(contactId)) {
      return null;
    }

    return this.contacts.deleteOne({ _id: new ObjectId(contactId) });
  }

  async getContactsCollection() {
    if (this.contacts) {
      return;
    }

    const client = await MongoClient.connect(MongoDB_URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    const db = client.db(DB_NAME);
    this.contacts = await db.createCollection("contacts");
  }
}

module.exports = new ContactModel();
