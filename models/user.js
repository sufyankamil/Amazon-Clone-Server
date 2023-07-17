const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: (val) => {
        const res =
          /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        return val.match(res);
      },
      message: "Please enter a valid email address",
    },
  },
  password: {
    require: true,
    type: String,
  },
  address: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "user",
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
