const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

const authRouter = express.Router();

authRouter.post("/api/signup", async(req, res) => {
  try{
    // these are the details required to create a new user
    const { name, email, password } = req.body;

    // check if the user already exists
    const existingUser = await User.findOne({ email: email});

    // if the user already exists then show the error message and return the user
    if(existingUser) {
      return res.status(400).json({message:'User already exists with email ' + email});
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    // else create a new user and return the user object
    let user = new User({
      email, password: hashedPassword, name
    })

    // save the user
    user =  await user.save();
    res.json(user);
  } catch (e) {
    res.status(500).json({error: e.message})
  }

});

module.exports = authRouter;
