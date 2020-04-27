const contactsFunctions = require("./contacts");

const argv = require("yargs").argv;

function invokeAction({ action, id, name, email, phone }) {
  switch (action) {
    case "list":
      contactsFunctions.listContacts();
      break;

    case "get":
      contactsFunctions.getContactById(id);
      break;

    case "add":
      contactsFunctions.addContact(name, email, phone);
      break;

    case "remove":
      contactsFunctions.removeContact(id);
      break;

    default:
      console.warn("\x1B[31m Unknown action type!");
  }
}

// invokeAction(argv);

server.get("/", (req, res, next) => {
  return res.status(200).send({ hello: "world" });
});

function addAllowOriginHeader(req, res, next) {
  res.set("Access-Control-Allow-Origin", "http://localhost:3000");
}

function addCorsHeaders(req, res, next) {
  res.set(
    "Access-Control-Allow-Method",
    req.headers["access-control-request-method"]
  );
  res.set(
    "Access-Control-Allow-Headers",
    req.headers["access-control-request-headers"]
  );

  res.status(200).send();
}
