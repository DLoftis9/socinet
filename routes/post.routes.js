const express = require("express");
const postController = require("../controllers/post.controllers");
const { check } = require("express-validator");

const postRouter = express.Router();

postRouter.get("/", postController.getPosts);

postRouter.post(
  "/post",
  [
    check("title", "Write a title").notEmpty(),
    check("title", "Title must be between 4 to 150 characters").isLength({
      min: 4,
      max: 150,
    }),

    //   body
    check("body", "Write a body").notEmpty(),
    check("body", "Body must be between 4 to 2000 characters").isLength({
      min: 4,
      max: 2000,
    }),
  ],
  postController.createPost
);

module.exports = postRouter;
