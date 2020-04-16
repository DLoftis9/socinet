const express = require("express");
const { getPosts, createPost } = require("../controllers/post.controllers");
const { requireSignin } = require("../controllers/auth.controllers");
const { userById } = require("../controllers/user.controllers");
const { check } = require("express-validator");

const postRouter = express.Router();

// if all user's aren't suppose to see all posts, add requireSignin middle for authorization
postRouter.get("/", getPosts);

postRouter.post("/post/new/:userId", requireSignin, createPost, [
  // title
  check("title", "Write a title").notEmpty(),
  check("title", "Title must be between 4 to 150 characters").isLength({
    min: 4,
    max: 150,
  }),

  // body
  check("body", "Write a body").notEmpty(),
  check("body", "Body must be between 4 to 2000 characters").isLength({
    min: 4,
    max: 2000,
  }),
]);

// any route container :userId, app wil first execute userById()
// use this method for requiring authorization in any part of the
// app where only the authenticated user can have authorization
postRouter.param("userId", userById);

module.exports = postRouter;
