const fs = require("fs");
const path = require("path");

const contactsPath = path.join(__dirname, "./db/contacts.json");

function listContacts() {
  fs.readFile(contactsPath, "utf8", (err, data) => {
    if (err) throw err;
    console.log(data);
  });
}

function getContactById(contactId) {
  fs.readFile(contactsPath, "utf8", (err, data) => {
    if (err) throw err;

    const filterContactsById = JSON.parse(data).filter(
      (data) => contactId === data.id
    );
    return console.log(filterContactsById);
  });
}

function removeContact(contactId) {
  fs.readFile(contactsPath, "utf8", (err, data) => {
    if (err) throw err;

    const filterContactsById = JSON.parse(data).filter(
      (data) => contactId !== data.id
    );
    return console.log(filterContactsById);
  });
}

function addContact({ name, email, phone }) {
  fs.readFile(contactsPath, "utf8", (err, data) => {
    if (err) throw err;

    const newContact = {
      name,
      email,
      phone,
    };
    const arrayContact = JSON.parse(data);
    arrayContact.push(newContact);
    return console.log(arrayContact);
  });
}

module.exports = { listContacts, getContactById, removeContact, addContact };
