const mongoose = require("mongoose");
const {
  Schema,
  Types: { ObjectId },
} = mongoose;

const contactSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
});

contactSchema.statics.getAllContacts = getAllContacts;
contactSchema.statics.addContactOnDb = addContactOnDb;
contactSchema.statics.getContactById = getContactById;
contactSchema.statics.updateContactById = updateContactById;
contactSchema.statics.removeContactById = removeContactById;

async function getAllContacts() {
  return this.find();
}

async function addContactOnDb(contactParams) {
  return this.create(contactParams);
}

async function getContactById(contactId) {
  if (!ObjectId.isValid(contactId)) {
    return null;
  }

  return this.findById(contactId);
}

async function updateContactById(contactId, contactParams) {
  if (!ObjectId.isValid(contactId)) {
    return null;
  }

  return this.findByIdAndUpdate(
    contactId,
    { $set: contactParams },
    { new: true }
  );
}

async function removeContactById(contactId) {
  if (!ObjectId.isValid(contactId)) {
    return null;
  }

  return this.findByIdAndDelete(contactId);
}

const contactModel = mongoose.model("contact", contactSchema);

module.exports = contactModel;
