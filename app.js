const app = require("express")();
const apiRouter = require("./routes/api");
const mongoose = require("mongoose");
const { DB_URL } = require("./config");


mongoose
  .connect(DB_URL)
  .then(() => {
    console.log("connected to the database!");
  })
  .catch();

app.use("/api", apiRouter);

app.use("/*", (req, res, next) => {
  next({ status: 404 });
});

app.use((err, req, res, next) => {
  res.status(500).send({ message: "Internal Server Error" });
});

module.exports = app;
