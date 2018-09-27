const usersRouter = require("express").Router();
const { getAllUsers } = require("../controllers/users");

usersRouter.route("/").get(getAllUsers);

module.exports = usersRouter;
