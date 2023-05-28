const User = require('../models/user');

//All users route
module.exports.getUsers = (req, res) => {
  User.find({})
    .then(users => {
      res.status(201).send(users);
    })
    .catch(err => {
      res.status(500).send({
        message: 'Произошла ошибка'
      })
    })
};

//User by id route
module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)

    .then(user => {
      res.status(201).send(user)
    })

    .catch(err => {
      if (err.name === "CastError") {
        res.status(404).send({
          message: 'Пользователь не найден'
        });
        return;
      }

      res.status(500).send({
        message: 'Произошла ошибка'
      })
    })
};

//Create user
module.exports.createUser = (req, res) => {
  const {name, about, avatar} = req.body;

  User.create({name, about, avatar})
    .then(user => {
      res.status(201).send(user)
    })
    .catch(err => {
      if (err.name === "ValidationError") {
        res.status(400).send({
          message: 'Переданы некорректные данные'
        });
        return;
      }

      res.status(500).send({
        message: 'Произошла ошибка'
      })
    })
};

//Update profile
module.exports.updateProfile = (req, res) => {
  const {name, about} = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    {name, about}
  )
    .then(user => {
      res.status(201).send(user)
    })
    .catch(err => {
      if (!req.user._id) {
        res.status(404).send({
          message: 'Пользователь не найден'
        });
        return;
      }

      if (err.name === "CastError") {
        res.status(400).send({
          message: 'Переданы некорректные данные'
        });
        return;
      }

      res.status(500).send({
        message: 'Произошла ошибка'
      })
    })
};

//Update avatar
module.exports.updateAvatar = (req, res) => {
  const {avatar} = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    {avatar}
  )
    .then(user => {
      res.status(201).send(user)
    })
    .catch(err => {
      if (!req.user._id) {
        res.status(404).send({
          message: 'Пользователь не найден'
        });
        return;
      }

      if (err.name === "CastError") {
        res.status(400).send({
          message: 'Переданы некорректные данные'
        });
        return;
      }

      res.status(500).send({
        message: 'Произошла ошибка'
      })
    })
};