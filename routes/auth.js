const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middlewares/auth");

const authRouter = express.Router();

// Sign up route
authRouter.post("/api/signup", async (req, res) => {
  try {
    // these are the details required to create a new user
    const { name, email, password } = req.body;

    // check if the user already exists
    const existingUser = await User.findOne({ email });

    // if the user already exists then show the error message and return the user
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with email " + email });
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    // else create a new user and return the user object
    let user = new User({
      email,
      password: hashedPassword,
      name,
    });

    // save the user
    user = await user.save();
    res.json(user);

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Sign in route
authRouter.post('/api/signin', async (req, res) => {
  try {
    const {email, password} = req.body;

    const user = await User.findOne({ email});
    if(!user) {
      return res.status(400).json({ message:"User not found with email" + req.body.email });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message:"Incorrect password provided" });
    }

    const token = jwt.sign({id: user._id}, "passwordToken",)
    res.json({token, ...user._doc});

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

authRouter.post('/tokenIsValid', async (req, res) => {
  try {
    const token = req.header('x-auth-token');
    if(!token) return res.json(false);
    const verified = jwt.verify(token, 'passwordToken');

    if(!verified) return res.json(false);

    const user = await User.findById(verified.id);

    if(!user) return res.json(false);

    res.json(true);

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// API to get user data
authRouter.get('/', auth, async function (req, res) {
  const user = await User.findById(req.user);
  res.json({ ...user._doc, token: req.token });
});


module.exports = authRouter;
