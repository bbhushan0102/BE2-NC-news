const topicsRouter = require("express").Router();
const { getAllTopics } = require("../controllers/topics");
const {
  getArticlesByTopic,
  postArticleByTopic
} = require("../controllers/articles");

topicsRouter.route("/").get(getAllTopics);

topicsRouter
  .route("/:topic_slug/articles")
  .get(getArticlesByTopic)
  .post(postArticleByTopic);

module.exports = topicsRouter;
