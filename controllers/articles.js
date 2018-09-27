const { Article } = require("../models");

const getAllArticles = (req, res, next) => {
  Article.find().then(articles => {
    res.status(200).json({ articles });
  });
};


module.exports = { getAllArticles };
