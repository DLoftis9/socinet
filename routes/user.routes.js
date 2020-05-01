const express = require("express");
const {
  userById,
  allUsers,
  getUser,
  updateUser,
  userPhoto,
  addFollowing,
  addFollower,
  removeFollowing,
  removeFollower,
  deleteUser,
} = require("../controllers/user.controllers");
const { requireSignin } = require("../controllers/auth.controllers");

const userRouter = express.Router();

// route to follow users
// IMPORTANT: addFollowing should be before addFollower
userRouter.put("/user/follow", requireSignin, addFollowing, addFollower);
userRouter.put(
  "/user/unfollow",
  requireSignin,
  removeFollowing,
  removeFollower
);

// route to return all users
userRouter.get("/users", allUsers);

// route to return single user with :userId
// requireSignin for authentication to view all users
userRouter.get("/user/:userId", requireSignin, getUser);

userRouter.put("/user/:userId", requireSignin, updateUser);

userRouter.get("/user/photo/:userId", userPhoto);

userRouter.delete("/user/:userId", requireSignin, deleteUser);

// any route containing :userId, app wil first execute userById()
// use this method for requiring authorization in any part of the
// app where only the authenticated user can have authorization
userRouter.param("userId", userById);

module.exports = userRouter;
