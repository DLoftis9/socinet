"use strict";

const express = require("express");

const UsersRouter = express.Router();

UsersRouter.get("/", (req, res) => {
  res.send("Welcome to the basic express App");
});

module.exports = UsersRouter;