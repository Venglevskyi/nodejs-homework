const { Router } = require("express");
const authOperations = require("../auth/operations");
const userOperations = require("./operations");

const upload = require("../auth/multerStorage");
const userRouter = Router();

userRouter.get(
  "/current",
  authOperations.authorize.bind(authOperations),
  userOperations.getCurrentUser.bind(userOperations)
);
userRouter.patch(
  "/:id",
  userOperations.updateSubscription.bind(userOperations)
);
userRouter.patch(
  "/avatars/:id",
  upload.single("avatarURL"),
  authOperations.compresedImageAvatar,
  authOperations.authorize.bind(authOperations),
  userOperations.updateAvatar.bind(userOperations)
);

module.exports = userRouter;
