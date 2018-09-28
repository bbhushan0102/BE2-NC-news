const { User } = require("../models");

const getAllUsers = (req, res, next) => {
  User.find()
    .then(users => {
      console.log(users);
      res.send({ users });
    })
    .catch(next);
};
const getUserByUserName = (req, res, next) => {
  const { username } = req.params;
  User.find({ username: username })
    .then(user => {
      res.status(200).send({ user });
    })
    .catch(next);
};

module.exports = { getAllUsers, getUserByUserName };
