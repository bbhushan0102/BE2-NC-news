const express = require("express");
const app = express();
const apiRouter = require("./routes/api");
const mongoose = require("mongoose");
const DB_URL = process.env.DB_URL || require("./config").DB_URL;
// const { DB_URL } = require("./config");
const bodyParser = require("body-parser");
const cors = require("cors");
app.use(cors());

app.use(bodyParser.json(), express.static("views"));
console.log(DB_URL);
mongoose
  .connect(
    DB_URL,
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log("connected to the database!", DB_URL);
  })
  .catch();

app.use("/api", apiRouter);
app.get("/", (req, res, next) => {
  res.sendFile("index.html");
});

app.use("/*", (req, res, next) => {
  next({ status: 404 });
});

app.use((err, req, res, next) => {
  if (err.name === "ValidationError" || err.name === "CastError") {
    res.status(400).send({ msg: err.message });
  } else next(err);
});
app.use((err, req, res, next) => {
  if (err.status === 404) res.status(404).send({ msg: "404 page not found" });
  else next(err);
});

app.use((err, req, res, next) => {
  res.status(500).send({ message: "Internal Server Error" });
});
// app.use(handle404s);

// app.use(handle400s);

// app.use(handle500s);

module.exports = app;
