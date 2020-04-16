const express = require("express");
const {
  userById,
  allUsers,
  getUser,
} = require("../controllers/user.controllers");
const { requireSignin } = require("../controllers/auth.controllers");

const userRouter = express.Router();

// route to return all users
userRouter.get("/users", allUsers);
// route to return single user with :userId
userRouter.get("/user/:userId", requireSignin, getUser);

// any route containing :userId, app wil first execute userById()
// use this method for requiring authorization in any part of the
// app where only the authenticated user can have authorization
userRouter.param("userId", userById);

module.exports = userRouter;
