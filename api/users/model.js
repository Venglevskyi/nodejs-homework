const mongoose = require("mongoose");
const {
  Schema,
  Types: { ObjectId },
} = mongoose;
const uuid = require("uuid");

const userSchema = new Schema({
  email: String,
  passwordHash: String,
  avatarURL: String,
  subscription: {
    type: String,
    enum: ["free", "pro", "premium"],
    default: "free",
  },
  verificationToken: String,
  token: String,
});

userSchema.statics.createUser = createUser;
userSchema.statics.findUserByEmail = findUserByEmail;
userSchema.statics.getUserById = getUserById;
userSchema.statics.updateUserById = updateUserById;
userSchema.statics.updateUserParams = updateUserParams;
userSchema.statics.findByVerificationToken = findByVerificationToken;
userSchema.statics.userVerified = userVerified;

async function createUser(userParams) {
  userParams.verificationToken = uuid.v4();
  return this.create(userParams);
}

async function findUserByEmail(email) {
  return this.findOne({ email });
}

async function getUserById(contactId) {
  if (!ObjectId.isValid(contactId)) {
    return null;
  }

  return this.findById(contactId);
}

async function updateUserById(id, token) {
  if (!ObjectId.isValid(id)) {
    return null;
  }
  return this.findByIdAndUpdate(id, { $set: token }, { new: true });
}

async function updateUserParams(contactId, userParams) {
  if (!ObjectId.isValid(contactId)) {
    return null;
  }

  return this.findByIdAndUpdate(
    contactId,
    { $set: { avatarURL: userParams } },
    { new: true }
  );
}

async function findByVerificationToken(verificationToken) {
  return this.findOne({ verificationToken });
}

async function userVerified(verificationToken) {
  return this.updateOne(
    { verificationToken },
    { $set: { verificationToken: null } }
  );
}

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
