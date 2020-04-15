"use strict";

const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const postRoutes = require("./routes/post.routes");
const authRoutes = require("./routes/auth.routes");

dotenv.config();

// Create the Express app.
const app = express();

//mongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

// Setup morgan which gives HTTP request logging.
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({
    message: "Socinet API",
  });
});

// Add routes.
// Routes defined in the router will only be considered
// if the request route starts with the /api path.
// app.use("/api", usersRoutes);
app.use("/api", postRoutes);
app.use("/api", authRoutes);
// Middleware for unauthorized users
app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ error: "Unauthorized" });
  }
});

// Setup a global error handler.
app.use((err, req, res, next) => {
  console.error(`Global error handler: ${JSON.stringify(err.stack)}`);

  res.status(500).json({
    message: err.message,
    error: process.env.NODE_ENV === "production" ? {} : err,
  });
});

// Body parser
app.use(express.urlencoded({ extended: false }));

// Set our port.
app.set("port", process.env.PORT || 5000);

// Start listening on our port.
const server = app.listen(app.get("port"), () => {
  console.log(`Server is listening on port ${server.address().port}`);
});
