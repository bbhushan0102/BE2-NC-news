const { Topic } = require("../models");

const getAllTopics = (req, res, next) => {
  Topic.find().then(topics => {
    res.status(200).json({ topics });
  });
};

module.exports = { getAllTopics };
