const { User } = require("../models");

const getAllUsers = (req, res, next) => {
  User.find().then(users => {
    res.status(200).json({ users });
  });
};

module.exports = { getAllUsers };
