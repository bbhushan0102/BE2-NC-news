const articlesRouter = require("express").Router();
const {
  getAllArticles,
  getArticleById,
  getCommentsById,
  addCommentByArticleID,
  changeArticleVote
} = require("../controllers/articles");

articlesRouter.route("/").get(getAllArticles);
articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(changeArticleVote);
articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsById)
  .post(addCommentByArticleID);

module.exports = articlesRouter;
