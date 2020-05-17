const userModel = require("../users/model");
const UnauthorizedError = require("../helpers/errors.constructors");

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
      const updatedSubscription = await userModel.updateUserSubscription(
        id,
        req.body
      );
      res.status(200).json(updatedSubscription);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new userOperations();
