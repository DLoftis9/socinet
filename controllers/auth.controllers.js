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
