const User = require('../models/user');
const {
  NOT_VALID_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  SERVER_ERROR_CODE,
} = require('../errors/errors');

// All users route
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(201).send({ users });
    })
    .catch((err) => {
      res.status(SERVER_ERROR_CODE).send({
        message: `Произошла ошибка ${err.message}`,
      });
    });
};

// User by id route
module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)

    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND_ERROR_CODE).send({
          message: 'Пользователь с таким id не найден',
        });
        return;
      }
      res.status(201).send(user);
    })

    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(NOT_VALID_ERROR_CODE).send({
          message: 'Переданы некорректные данные',
        });
        return;
      }

      res.status(SERVER_ERROR_CODE).send({
        message: `Произошла ошибка ${err.message}`,
      });
    });
};

// Create user
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(NOT_VALID_ERROR_CODE).send({
          message: 'Переданы некорректные данные',
        });
        return;
      }

      res.status(SERVER_ERROR_CODE).send({
        message: `Произошла ошибка ${err.message}`,
      });
    });
};

// Update profile
module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true },
  )
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND_ERROR_CODE).send({
          message: 'Пользователь с таким id не найден',
        });
        return;
      }

      if (!req.body.name || !req.body.about) {
        res.status(NOT_VALID_ERROR_CODE).send({
          message: 'Переданы некорректные данные',
        });
        return;
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      res.status(SERVER_ERROR_CODE).send({
        message: `Произошла ошибка ${err.message}`,
      });
    });
};

// Update avatar
module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true },
  )
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND_ERROR_CODE).send({
          message: 'Пользователь с таким id не найден',
        });
        return;
      }

      if (!req.body.avatar) {
        res.status(NOT_VALID_ERROR_CODE).send({
          message: 'Переданы некорректные данные',
        });
        return;
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      res.status(SERVER_ERROR_CODE).send({
        message: `Произошла ошибка ${err.message}`,
      });
    });
};
