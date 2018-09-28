const usersRouter = require("express").Router();
const { getAllUsers, getUserByUserName } = require("../controllers/users");

usersRouter.route("/").get(getAllUsers);
usersRouter.route("/:username").get(getUserByUserName);

module.exports = usersRouter;
