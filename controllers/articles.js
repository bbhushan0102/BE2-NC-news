const { Article, Comment, Topic } = require("../models");

const getAllArticles = (req, res, next) => {
  Article.find()
    .populate("created_by")
    .lean()
    .then(articles => {
      return Promise.all([
        articles,
        ...articles.map(article => {
          const commentCount = Comment.count({ belongs_to: article._id });
          return commentCount;
        })
      ]);
    })
    .then(([articles, ...commentCount]) => {
      return Promise.all([
        articles.map((article, index) => {
          return { ...article, comments: commentCount[index] };
        })
      ])
        .then(([articles]) => {
          res.status(200).send({ articles });
        })
        .catch(next);
    });
};

const getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  return Promise.all([
    Comment.count({ belongs_to: article_id }),
    Article.findById(article_id)
      .populate("created_by")
      .lean()
  ])
    .then(([commentCount, article]) => {
      if (!article) {
        return Promise.reject({ msg: "id does not exist", status: 404 });
      }
      article = { ...article, comments: commentCount };
      res.status(200).send({ article });
    })
    .catch(next);
};

const getCommentsById = (req, res, next) => {
  const { article_id } = req.params;
  return Promise.all([
    Article.findById(article_id),
    Comment.find({ belongs_to: article_id })
      .populate("created_by")
      .populate("belongs_to")
  ])
    .then(([article, comments]) => {
      if (!article) throw { msg: "article ID does not exist", status: 404 };
      res.status(200).send({ comments });
    })
    .catch(next);
};
const addCommentByArticleID = (req, res, next) => {
  const { article_id } = req.params;
  const newComment = req.body;

  newComment.belongs_to = article_id;
  Comment.create(newComment)
    .then(comment => {
      res.status(201).send({ comment });
    })
    .catch(next);
};
const getArticlesByTopic = (req, res, next) => {
  const { topic_slug } = req.params;
  Article.find({ belongs_to: topic_slug })
    .populate("created_by")
    .lean()
    .then(articles => {
      return Promise.all([
        articles,
        ...articles.map(article => {
          const commentCount = Comment.count({ belongs_to: article._id });
          return commentCount;
        })
      ]);
    })
    .then(([articles, ...commentCount]) =>
      articles.map((article, index) => {
        return { ...article, comments: commentCount[index] };
      })
    )
    .then(topicArticles => {
      if (!topicArticles.length)
        throw { msg: "topic does not exist", status: 404 };
      res.status(200).send({ topicArticles });
    })
    .catch(next);
};

const postArticleByTopic = (req, res, next) => {
  const { topic_slug } = req.params;
  const newArticle = req.body;
  newArticle.belongs_to = topic_slug;
  Article.create(newArticle)
    .then(article1 => {
      const article = { ...article1._doc };
      res.status(201).send({ article });
    })
    .catch(next);
};

const changeArticleVote = (req, res, next) => {
  const { article_id } = req.params;
  if (req.query.vote === "up") {
    Article.findByIdAndUpdate(
      { _id: article_id },
      { $inc: { votes: 1 } },
      { new: true }
    ).then(article => {
      if (!article) throw { Status: 404, msg: "article id does not exist" };
      res.status(200).send({ article });
    });
  } else if (req.query.vote === "down") {
    Article.findByIdAndUpdate(
      { _id: article_id },
      { $inc: { votes: -1 } },
      { new: true }
    )
      .then(article => {
        if (!article) throw { Status: 404, msg: "article id does not exist" };
        res.status(200).send({ article });
      })
      .catch(next);
  }
};

module.exports = {
  getAllArticles,
  getArticleById,
  getCommentsById,
  addCommentByArticleID,
  getArticlesByTopic,
  postArticleByTopic,
  changeArticleVote
};
