const userModel = require("../users/model");
const UnauthorizedError = require("../helpers/errors.constructors");
require("dotenv").config();
const SERVER_DOMEN = process.env.SERVER_DOMEN;
const IMAGE_BASE_URL = process.env.IMAGE_BASE_URL;

class userOperations {
  async getCurrentUser(req, res, next) {
    try {
      const { _id } = req.user;
      const currentUser = await userModel.getUserById(_id);
      if (!currentUser) {
        throw new UnauthorizedError("Not authorized");
      }
      return res.status(200).json({
        email: currentUser.email,
        subscription: currentUser.subscription,
      });
    } catch (err) {
      next(err);
    }
  }

  async updateSubscription(req, res, next) {
    try {
      const { id } = req.params;
      await userModel.getUserById(id);
      const updatedSubscription = await userModel.updateUserParams(
        id,
        req.body
      );
      res.status(200).json(updatedSubscription);
    } catch (err) {
      next(err);
    }
  }

  async updateAvatar(req, res, next) {
    try {
      const { _id } = req.user;
      const imageUrl = `${SERVER_DOMEN}/${IMAGE_BASE_URL}/${req.file.filename}`;
      const updatedAvatar = await userModel.updateUserParams(_id, imageUrl);
      if (!updatedAvatar) {
        throw new UnauthorizedError("Not authorized");
      }
      res.status(200).json({ avatarURL: updatedAvatar.avatarURL });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new userOperations();
