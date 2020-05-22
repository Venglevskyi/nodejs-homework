require("dotenv").config();
const PATH_UPLOADED_AVATAR = process.env.PATH_UPLOADED_AVATAR;
const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, PATH_UPLOADED_AVATAR);
  },
  filename: function (req, file, cb) {
    const { ext } = path.parse(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});
const upload = multer({ storage });

module.exports = upload;
