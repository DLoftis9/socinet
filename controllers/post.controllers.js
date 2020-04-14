const Post = require("../models/post.model");
const { validationResult } = require("express-validator");

exports.getPosts = (req, res) => {
  res.json({
    posts: [{ title: "post one" }, { title: "posts two" }],
  });
};

exports.createPost = (req, res) => {
  //   check for errors
  const errors = validationResult(req);

  // if error show the first one as they happen
  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg);
    return res.status(400).json({ error: firstError });
  }

  const post = new Post(req.body);

  post.save().then((result) => {
    res.status(200).json({
      post: result,
    });
  });
};
