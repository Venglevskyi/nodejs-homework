const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const userModel = require("../users/model");
const ExistingEmailError = require("../helpers/errors.constructors");
const UnauthorizedError = require("../helpers/errors.constructors");
const JWT_SECRET = process.env.JWT_SECRET;

class authOperations {
  constructor() {
    this.saltRounds = 4;
  }

  async registerUser(req, res, next) {
    try {
      const { email, password, subscription } = req.body;
      const existingUser = await userModel.findUserByEmail(email);
      if (existingUser) {
        throw new ExistingEmailError("Email in use");
      }

      const passwordHash = await this.hashPassword(password);
      const createdUser = await userModel.createUser({
        email,
        passwordHash,
        subscription,
      });

      return res
        .status(201)
        .json({ user: this.composeUserForResponse(createdUser) });
    } catch (err) {
      next(err);
    }
  }

  async logIn(req, res, next) {
    try {
      const { email, password } = req.body;
      const existingUser = await userModel.findUserByEmail(email);
      if (!existingUser) {
        throw new UnauthorizedError("#");
      }

      const isPasswordCorrect = await this.compareHashPassword(
        password,
        existingUser.passwordHash
      );
      if (!isPasswordCorrect) {
        throw new UnauthorizedError("Неверный логин или пароль");
      }

      const token = this.createToken(existingUser._id);
      await userModel.updateUserById(existingUser._id, { token });

      return res
        .status(200)
        .json({ token, user: this.composeUserForResponse(existingUser) });
    } catch (err) {
      next(err);
    }
  }

  async logOut(req, res, next) {
    try {
      const { _id } = req.user;
      const updateToken = await userModel.updateUserById(_id, { token: null });
      if (!updateToken) {
        throw new UnauthorizedError("Not authorized");
      }
      return res.status(200).json("Logout success");
    } catch (err) {
      next(err);
    }
  }

  async getCurrentUser(req, res, next) {
    try {
      const { _id } = req.user;
      const currentUser = await userModel.getUserById(_id);
      if (!currentUser) {
        throw new UnauthorizedError("Not authorized");
      }
      return res.status(200).json(this.composeUserForResponse(currentUser));
    } catch (err) {
      next(err);
    }
  }

  async authorize(req, res, next) {
    try {
      const authorizationHeader = req.get("Authorization");
      const token = authorizationHeader.replace("Bearer ", "");
      let getIdFromToken;
      try {
        getIdFromToken = await jwt.verify(token, JWT_SECRET).uid;
      } catch (err) {
        next(new UnauthorizedError("Not authorized"));
      }

      const user = await userModel.getUserById(getIdFromToken);
      if (!user) {
        throw new UnauthorizedError("Not authorized");
      }

      req.user = user;
      req.token = token;

      next();
    } catch (err) {
      next(err);
    }
  }

  async validateRegisterUser(req, res, next) {
    const userRules = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
      subscription: Joi.string(),
    });

    const result = Joi.validate(req.body, userRules);
    if (result.error) {
      return res.status(422).json({ message: "Missing required fields" });
    }
    next();
  }

  async validateLogIn(req, res, next) {
    const userRules = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    });

    const result = Joi.validate(req.body, userRules);
    if (result.error) {
      return res.status(422).json({ message: "Missing required fields" });
    }
    next();
  }

  async hashPassword(password) {
    return await bcrypt.hash(password, this.saltRounds);
  }

  async compareHashPassword(password, passwordHash) {
    return await bcrypt.compare(password, passwordHash);
  }

  createToken(uid) {
    return jwt.sign({ uid }, JWT_SECRET);
  }

  composeUserForResponse(user) {
    return {
      email: user.email,
      subscription: user.subscription,
    };
  }
}

module.exports = new authOperations();
