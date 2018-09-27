const articlesRouter = require("express").Router();
const { getAllArticles} = require("../controllers/articles");

articlesRouter.route("/").get(getAllArticles);


module.exports = articlesRouter;
