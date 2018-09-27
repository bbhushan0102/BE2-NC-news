const { Comment } = require("../models");

const getAllComments = (req, res, next) => {
  Comment.find().then(comments => {
    res.status(200).json({ comments });
  });
};

module.exports = { getAllComments };
