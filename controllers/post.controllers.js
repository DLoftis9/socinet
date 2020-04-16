const Post = require("../models/post.model");
const formidable = require("formidable");
const fs = require("fs");
const { validationResult } = require("express-validator");

exports.getPosts = (req, res) => {
  Post.find()
    .select("_id title body")
    .then((posts) => {
      res.json({ posts });
    })
    .catch((err) => console.log(err));
};

exports.createPost = (req, res, next) => {
  // check for errors
  const errors = validationResult(req);

  // if error show the first one as they happen
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
