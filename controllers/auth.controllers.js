const jwt = require("jsonwebtoken");
require("dotenv").config();
const expressJWT = require("express-jwt");
const User = require("../models/user.model");
const { validationResult } = require("express-validator");

exports.signup = async (req, res) => {
  // check for errors
  const errors = validationResult(req);

  // if error show the first one as they happen
  if (!errors.isEmpty()) {
    const returnError = errors.array().map((error) => error.msg);
    return res.status(400).json({ error: returnError });
  }

  const userExists = await User.findOne({ email: req.body.email });
  if (userExists)
    return res.status(403).json({
      error: "Email is taken",
    });
  const user = await new User(req.body);
  await user.save();
  res.status(200).json({ message: "Successfully signed up!" });
};

exports.signin = (req, res) => {
  // find the user based on email
  const { _id, email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    // if error or no user
    if (err || !user) {
      return res.status(401).json({
        error: "User with that email does not exist. Please signup",
      });
    }

    // if user is found make sure the email and password match
    // create authenticate method in model and use here
    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "Email and password do not match",
      });
    }
    // generate a token with user id and secret
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    // persist the token as 't' in cookie with with expiration date
    res.cookie("t", token, { expire: new Date() + 9999 });

    // return response with user and token to frontend client
    const { _id, name, email } = user;
    return res.json({ token, user: { _id, email, name } });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("t");
  return res.json({ message: "Successfully signed out!" });
};

exports.requireSignin = expressJWT({
  secret: process.env.JWT_SECRET,
});
