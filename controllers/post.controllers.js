const Post = require("../models/post.model");
const { validationResult } = require("express-validator");

exports.getPosts = (req, res) => {
  Post.find()
    .select("_id title body")
    .then((posts) => {
      res.json({ posts });
    })
    .catch((err) => console.log(err));
};

exports.createPost = (req, res) => {
  // check for errors
  const errors = validationResult(req);

  // if error show the first one as they happen
  if (!errors.isEmpty()) {
    const returnError = errors.array().map((error) => error.msg);
    return res.status(400).json({ error: returnError });
  }

  const post = new Post(req.body);

  post.save().then((result) => {
    res.json({
      post: result,
    });
  });
};
