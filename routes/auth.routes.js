const express = require("express");
const { signup, signin, signout } = require("../controllers/auth.controllers");
const { userById } = require("../controllers/user.controllers");
const { check } = require("express-validator");

const authRouter = express.Router();

authRouter.post(
  "/signup",
  [
    // name
    check("name", "Name is required").notEmpty(),
    check("name", "Name must be between 4 to 150 characters").isLength({
      min: 4,
      max: 150,
    }),

    // email
    check("email", "Email is required").notEmpty(),
    check("email", "Email must be between 3 to 32 characters")
      .matches(/.+\@.+\..+/)
      .withMessage("Email must contain @")
      .isLength({
        min: 3,
        max: 32,
      }),

    // password
    check("password", "Password is required").notEmpty(),
    check("password", "Body must be between 4 to 2000 characters")
      .isLength({
        min: 6,
      })
      .withMessage("Password must contain at least 6 characters")
      .matches(/\d/)
      .withMessage("Password must contain a number"),
  ],
  signup
);

authRouter.post(
  "/signin",
  [
    // email
    check("email", "Email is required").notEmpty(),
    check("email", "Email must be between 3 to 32 characters")
      .matches(/.+\@.+\..+/)
      .withMessage("Email must contain @")
      .isLength({
        min: 3,
        max: 32,
      }),

    // password
    check("password", "Password is required").notEmpty(),
    check("password", "Body must be between 4 to 2000 characters")
      .isLength({
        min: 6,
      })
      .withMessage("Password must contain at least 6 characters")
      .matches(/\d/)
      .withMessage("Password must contain a number"),
  ],
  signin
);

authRouter.get("/signout", signout);

// any route container :userId, app wil first execute userById()
// use this method for requiring authorization in any part of the
// app where only the authenticated user can have authorization
authRouter.param("userId", userById);

module.exports = authRouter;
