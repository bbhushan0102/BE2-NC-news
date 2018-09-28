const { Comment } = require("../models");

const getAllComments = (req, res, next) => {
  Comment.find()
    .then(comments => {
      res.status(200).send({ comments });
    })
    .catch(next);
};
//change comment votes by one up or down
const changeCommentVotes = (req, res, next) => {
  const { comment_id } = req.params;
  if (req.query.vote == "up") {
    Comment.findByIdAndUpdate(
      { _id: comment_id },
      { $set: { votes: +1 } },
      { new: true }
    )
      .then(comment => {
        if (!comment) throw { msg: "comment ID does not exist", status: 404 };
        res.status(200).send({ comment });
      })
      .catch(next);
  } else if (req.query.vote == "down") {
    Comment.findByIdAndUpdate(
      { _id: comment_id },
      { $set: { votes: -1 } },
      { new: true }
    )
      .then(comment => {
        if (!comment) throw { msg: "comment ID does not exist", status: 404 };
        res.status(200).send({ comment });
      })
      .catch(next);
  }
};
const deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  Comment.findByIdAndDelete({ _id: comment_id })
    .then(() => {
      res.status(200).send({ msg: "Comment successfully deleted" });
    })
    .catch(next);
};

module.exports = { getAllComments, changeCommentVotes, deleteCommentById };
