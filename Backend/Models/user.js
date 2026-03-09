const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
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
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
