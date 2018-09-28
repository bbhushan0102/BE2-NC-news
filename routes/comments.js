const commentsRouter = require("express").Router();
const {
  getAllComments,
  changeCommentVotes,
  deleteCommentById
} = require("../controllers/comments");

commentsRouter.route("/").get(getAllComments);
commentsRouter.route("/:comment_id")
.patch(changeCommentVotes)
.delete(deleteCommentById);

module.exports = commentsRouter;
