const { Router } = require("express");

const authRouter = Router();
const authOperations = require("./operations");

authRouter.post(
  "/register",
  authOperations.validateRegisterUser,
  authOperations.registerUser.bind(authOperations)
);
authRouter.post(
  "/login",
  authOperations.validateLogIn,
  authOperations.logIn.bind(authOperations)
);
authRouter.post(
  "/logout",
  authOperations.authorize,
  authOperations.logOut.bind(authOperations)
);

module.exports = authRouter;
