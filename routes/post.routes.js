const express = require('express');
const postController = require('../controllers/post.controllers');

const postRouter = express.Router();

postRouter.get('/', postController.getPosts)

module.exports = postRouter;