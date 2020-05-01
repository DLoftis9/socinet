const _ = require("lodash");
const User = require("../models/user.model");
const formidable = require("formidable");
const fs = require("fs");

// method to find a user and return them
exports.userById = (req, res, next, id) => {
  // populate followers and following users array
  // the populate method for followers and following
  // can be removed if the following feature needs to be disabled
  User.findById(id)
    .populate("following", "_id name")
    .populate("followers", "_id name")
    .exec((err, user) => {
      if (err || !user) {
        return res.status(400).json({
          error: "User not found",
        });
      }

      // adds profile object in req with user info
      req.profile = user;
      next();
    });
};

// method to check if user is authorized to perform a certain action
exports.hasAuthorization = (req, res, next) => {
  const authorized =
    req.profile && req.auth && req.profile._id === req.auth._id;

  if (!authorized) {
    return res.status(403).json({
      error: "User is not authorized to perform this action",
    });
  }
};

// method to return all users
exports.allUsers = (req, res) => {
  User.find((err, users) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }

    res.json(users);
  }).select("name email updated created");
};

// method to return a single user
exports.getUser = (req, res) => {
  // defining returned user data password and salt as undefined
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  return res.json(req.profile);
};

// method to update a user's data
exports.updateUser = (req, res, next) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: ["Photo could not be uploaded"],
      });
    }

    // save user
    let user = req.profile;
    user = _.extend(user, fields);
    user.updated = Date.now();

    if (files.photo) {
      user.photo.data = fs.readFileSync(files.photo.path);
      user.photo.contentType = files.photo.type;
    }

    user.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }

      user.hashed_password = undefined;
      user.salt = undefined;
      res.json(user);
    });
  });
};

// method to set a user's profile image
exports.userPhoto = (req, res, next) => {
  if (req.profile.photo.data) {
    res.set("Content-Type", req.profile.photo.contentType);
    return res.send(req.profile.photo.data);
  }

  next();
};

// method to delete a user's profile
exports.deleteUser = (req, res, next) => {
  let user = req.profile;
  user.remove((err, user) => {
    if (err) {
      return res.status(400).json({
        error: "There was a problem while trying to delete a user",
      });
    }

    res.json({ message: "User has been deleted" });
  });
};

// follow and unfollow methods
exports.addFollowing = (req, res, next) => {
  User.findByIdAndUpdate(
    req.body.userId,
    {
      $push: {
        following: req.body.followId,
      },
    },
    (err, reasult) => {
      if (err) {
        return res.status(400).json({ error: err });
      }
      next();
    }
  );
};

exports.addFollower = (req, res) => {
  User.findByIdAndUpdate(
    req.body.followId,
    {
      $push: {
        followers: req.body.userId,
      },
    },
    // this object is set so mongo doesn't return the old data
    { new: true }
  )
    .populate("following", "_id name")
    .populate("followers", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }

      result.hashed_password = undefined;
      result.salt = undefined;
      res.json(result);
    });
};

// removefollow and unfollow methods
exports.removeFollowing = (req, res, next) => {
  User.findByIdAndUpdate(
    req.body.userId,
    {
      $pull: {
        following: req.body.unfollowId,
      },
    },
    (err, reasult) => {
      if (err) {
        return res.status(400).json({ error: err });
      }
      next();
    }
  );
};

exports.removeFollower = (req, res) => {
  User.findByIdAndUpdate(
    req.body.unfollowId,
    {
      $pull: {
        followers: req.body.userId,
      },
    },
    // this object is set so mongo doesn't return the old data
    { new: true }
  )
    .populate("following", "_id name")
    .populate("followers", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }

      result.hashed_password = undefined;
      result.salt = undefined;
      res.json(result);
    });
};
