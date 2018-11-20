const { User } = require("../models");

const getAllUsers = (req, res, next) => {
  User.find()
    .then(users => {
      res.send({ users });
    })
    .catch(next);
};
const getUserByUserName = (req, res, next) => {
  const { username } = req.params;
  User.find({ username: username })
    .then(user => {
      if (user.length === 0) throw { msg: "user does not exist", status: 404 };
      res.status(200).send({ user: user[0] });
    })
    .catch(next);
};

module.exports = { getAllUsers, getUserByUserName };
