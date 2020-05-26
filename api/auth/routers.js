const { Router } = require("express");

const authRouter = Router();
const authOperations = require("./operations");
const upload = require("./multerStorage");

authRouter.post(
  "/register",
  upload.single("avatarURL"),
  authOperations.compresedImageAvatar,
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
