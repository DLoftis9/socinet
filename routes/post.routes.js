const express = require("express");
const {
  getPosts,
  createPost,
  postsByUser,
  postById,
  isPoster,
  deletePost,
  updatePost,
  singlePost,
  photo,
  like,
  unlike,
  comment,
  uncomment,
} = require("../controllers/post.controllers");
const { requireSignin } = require("../controllers/auth.controllers");
const { userById } = require("../controllers/user.controllers");
const { check } = require("express-validator");

const postRouter = express.Router();

// if all user's aren't suppose to see all posts, add requireSignin middle for authorization
postRouter.get("/posts", getPosts);

// like / unlike logic
postRouter.put("/post/like", requireSignin, like);
postRouter.put("/post/unlike", requireSignin, unlike);

// comments
postRouter.put("/post/comment", requireSignin, comment);
postRouter.put("/post/uncomment", requireSignin, uncomment);

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

postRouter.get("/posts/by/:userId", requireSignin, postsByUser);
postRouter.get("/post/:postId", singlePost);

postRouter.delete("/post/:postId", requireSignin, isPoster, deletePost);
postRouter.put("/post/:postId", requireSignin, isPoster, updatePost);

// photo
postRouter.get("/post/photo/:postId", photo);

// any route container :userId, app wil first execute userById()
// use this method for requiring authorization in any part of the
// app where only the authenticated user can have authorization
postRouter.param("userId", userById);

// any route container :postId, the app will first execute postById()
postRouter.param("postId", postById);

module.exports = postRouter;
