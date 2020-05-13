const mongoose = require("mongoose");
const {
  Schema,
  Types: { ObjectId },
} = mongoose;

const userSchema = new Schema({
  email: String,
  passwordHash: String,
  subscription: {
    type: String,
    enum: ["free", "pro", "premium"],
    default: "free",
  },
  token: String,
});

userSchema.statics.createUser = createUser;
userSchema.statics.findUserByEmail = findUserByEmail;
userSchema.statics.getUserById = getUserById;
userSchema.statics.updateUserById = updateUserById;

async function createUser(userParams) {
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

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
