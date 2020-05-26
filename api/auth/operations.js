const Joi = require("@hapi/joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const imagemin = require("imagemin");
const imageminJpegtran = require("imagemin-jpegtran");
const imageminPngquant = require("imagemin-pngquant");
// const toonavatar = require("cartoon-avatar");
const fsPromises = require("fs").promises;
require("dotenv").config();
const sgMail = require("@sendgrid/mail");

const userModel = require("../users/model");
const ExistingEmailError = require("../helpers/errors.constructors");
const UnauthorizedError = require("../helpers/errors.constructors");
const NotFoundError = require("../helpers/errors.constructors");

class authOperations {
  constructor() {
    this.saltRounds = 4;
    sgMail.setApiKey(process.env.SENDGRID_API_TOKEN);
  }

  async registerUser(req, res, next) {
    try {
      const { SERVER_DOMEN, IMAGE_BASE_URL } = process.env;
      const { email, password, subscription } = req.body;
      const existingUser = await userModel.findUserByEmail(email);
      if (existingUser) {
        throw new ExistingEmailError("Email in use");
      }

      const passwordHash = await this.hashPassword(password);
      const imageUrl = `${SERVER_DOMEN}/${IMAGE_BASE_URL}/${req.file.filename}`;

      const createdUser = await userModel.createUser({
        email,
        passwordHash,
        avatarURL: imageUrl,
        subscription,
      });

      const token = this.createToken(createdUser._id);

      this.sendVerificationToken(createdUser);

      return res
        .status(201)
        .json({ token, user: this.composeUserForResponse(createdUser) });
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
      if (existingUser.verificationToken !== null) {
        throw new NotFoundError("User not verified");
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

  async authorize(req, res, next) {
    try {
      const { JWT_SECRET } = process.env;
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

  async verifyUser(req, res, next) {
    try {
      const { verificationToken } = req.params;
      const wasUserVerified = await userModel.findByVerificationToken(
        verificationToken
      );
      if (!wasUserVerified) {
        throw new NotFoundError("User not found");
      }

      await userModel.userVerified(verificationToken);

      return res.status(200).send("User verified");
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

    const hasAvatarImage = req.file && req.file.fieldname === "avatarURL";
    if (!hasAvatarImage) {
      return res.status(422).json({ message: "Missing required fields" });
    }

    const result = userRules.validate(req.body);
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

    const result = userRules.validate(req.body);
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
    const { JWT_SECRET } = process.env;
    return jwt.sign({ uid }, JWT_SECRET);
  }

  async sendVerificationToken(user) {
    const { SERVER_DOMEN, SENDER_EMAIL } = process.env;
    const createVerifyLink = `${SERVER_DOMEN}/auth/verify/${user.verificationToken}`;

    await sgMail.send({
      to: user.email,
      from: SENDER_EMAIL,
      subject: "Please verify your email",
      html: `<p style="text-align: center; font-size: 16px">Hello user</p>
      <a href=${createVerifyLink} style="width: 150px;
        height: 30px;
        text-decoration: none;
        padding-top: 9px;
        color: #ffffff;
        text-align: center;
        line-height: 20px;
        display: block;
        margin: 20px auto;
        font: normal 17px arial;
        background-color: #3b2751"}>Click link to verify</a>`,
    });
  }

  composeUserForResponse(user) {
    return {
      email: user.email,
      subscription: user.subscription,
    };
  }

  async compresedImageAvatar(req, res, next) {
    try {
      const pathBeforeCompresed = `${req.file.destination}/${req.file.filename}`;

      await imagemin([pathBeforeCompresed], {
        destination: "api/public/images",
        plugins: [
          imageminJpegtran(),
          imageminPngquant({
            quality: [0.6, 0.8],
          }),
        ],
      });

      req.file.path = `${"api/public/images"}/${req.file.filename}`;
      await fsPromises.unlink(pathBeforeCompresed);
      next();
    } catch (err) {
      next();
    }
  }
}

module.exports = new authOperations();
