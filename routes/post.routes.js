const express = require("express");
const { getPosts, createPost} = require("../controllers/post.controllers");
const { check } = require("express-validator");

const postRouter = express.Router();

postRouter.get("/", getPosts);

postRouter.post(
  "/post",
  [
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
  ],
  createPost
);

module.exports = postRouter;
