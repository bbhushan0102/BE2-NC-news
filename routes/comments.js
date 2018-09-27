const commentsRouter = require("express").Router();
const { getAllComments } = require("../controllers/comments");

commentsRouter.route("/").get(getAllComments);


module.exports = commentsRouter;