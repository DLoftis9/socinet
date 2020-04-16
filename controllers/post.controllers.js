const Post = require("../models/post.model");
const formidable = require("formidable");
const fs = require("fs");
const { validationResult } = require("express-validator");

exports.postById = (req, res, next, id) => {
  Post.findById(id)
    .populate("postedBy", "_id name")
    .exec((err, post) => {
      if (err || !post) {
        return res.status(400).json({
          error: err,
        });
      }

      req.post = post;
      next();
    });
};

exports.getPosts = (req, res) => {
  const posts = Post.find()
    .populate("postedBy", "_id name")
    .select("_id title body")
    .then((posts) => {
      res.json({ posts });
    })
    .catch((err) => console.log(err));
};

exports.createPost = (req, res, next) => {
  // check for errors
  const errors = validationResult(req);

  // if error show when they happen
  if (!errors.isEmpty()) {
    const returnError = errors.array().map((error) => error.msg);
    return res.status(400).json({ error: returnError });
  }

  // capabilities for adding images
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded",
      });
    }

    // add photo from the client
    let post = new Post(fields);

    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    post.postedBy = req.profile;

    if (files.photo) {
      post.photo.data = fs.readFileSync(files.photo.path);
      post.photo.contentType = files.photo.type;
    }

    post.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      res.json(result);
    });
  });
};

exports.postsByUser = (req, res) => {
  Post.find({ postedBy: req.profile._id })
    .populate("postedBy", "_id name")
    .sort("_created")
    .exec((err, posts) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      res.json(posts);
    });
};

exports.isPoster = (req, res, next) => {
  let isPoster = req.post && req.auth && req.post.postedBy._id == req.auth._id;

  if (!isPoster) {
    return res.status(403).json({
      error: "User is not authorized",
    });
  }
  next();
};

exports.deletePost = (req, res) => {
  let post = req.post;
  post.remove((err, post) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }

    res.json({
      message: "Post deleted successfully",
    });
  });
};
