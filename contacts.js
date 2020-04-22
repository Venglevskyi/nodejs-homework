const fs = require("fs");
const path = require("path");

const contactsPath = path.join(__dirname, "./db/contacts.json");

function listContacts() {
  fs.readFile(contactsPath, "utf8", (err, data) => {
    if (err) throw err;
    console.table(JSON.parse(data));
  });
}

function getContactById(contactId) {
  fs.readFile(contactsPath, "utf8", (err, data) => {
    if (err) throw err;

    const filterContactsById = JSON.parse(data).filter(
      (data) => contactId === data.id
    );
    return console.table(filterContactsById);
  });
}

function removeContact(contactId) {
  fs.readFile(contactsPath, "utf8", (err, data) => {
    if (err) throw err;

    const removeContacts = JSON.parse(data).filter(
      (data) => contactId !== data.id
    );
    return console.table(removeContacts);
  });
}

function addContact(name, email, phone) {
  fs.readFile(contactsPath, "utf8", (err, data) => {
    if (err) throw err;

    const newContact = {
      name,
      email,
      phone,
    };
    const addContact = JSON.parse(data);
    addContact.push(newContact);
    return console.table(addContact);
  });
}

module.exports = { listContacts, getContactById, removeContact, addContact };
