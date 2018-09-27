const mongoose = require("mongoose");
const { User, Article, Comment, Topic } = require("../models");
const {
  createRefObj,
  formatArticleData,
  createArticleObj,
  formatCommentData
} = require("./utils");

const seedDB = ({ userData, articleData, commentData, topicData }) => {
  return mongoose.connection
    .dropDatabase()
    .then(() => {
      return Promise.all([
        User.insertMany(userData),
        Topic.insertMany(topicData)
      ]);
    })
    .then(([userDocs, topicDocs]) => {
      const userRefObj = createRefObj(userData, userDocs);
      return Promise.all([
        userDocs,
        topicDocs,
        Article.insertMany(
          formatArticleData(articleData, userRefObj, topicDocs)
        )
      ]);
    })
    .then(([userDocs, topicDocs, articleDocs]) => {
      const userRefObj = createRefObj(userData, userDocs);
      return Promise.all([
        userDocs,
        topicDocs,
        articleDocs,
        Comment.insertMany(
          formatCommentData(commentData, articleDocs, userRefObj)
        )
      ]);
    });
};
module.exports = seedDB;
// Comment.insertMany(
//   formatCommentData(commentData, userRefObj, articaRefObj)
// )
