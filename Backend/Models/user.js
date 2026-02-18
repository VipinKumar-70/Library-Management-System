const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  course: String,
  enrollment: Number,
  school: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: String,
  verified: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("user", userSchema);
