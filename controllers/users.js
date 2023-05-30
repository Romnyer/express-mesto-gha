const mongooseError = require('mongoose').Error;

const User = require('../models/user');
const {
  OK_STATUS_CODE,
  CREATED_STATUS_CODE,
  NOT_VALID_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  SERVER_ERROR_CODE,
} = require('../constants/constants');

// All users route
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(OK_STATUS_CODE).send({ users });
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
      res.status(OK_STATUS_CODE).send(user);
    })

    .catch((err) => {
      if (err instanceof mongooseError.CastError) {
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
      res.status(CREATED_STATUS_CODE).send(user);
    })
    .catch((err) => {
      if (err instanceof mongooseError.ValidationError) {
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
function updateUser(id, body, res) {
  User.findByIdAndUpdate(
    id,
    body,
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => {
      res.status(OK_STATUS_CODE).send(user);
    })
    .catch((err) => {
      if (err instanceof mongooseError.DocumentNotFoundError) {
        res.status(NOT_FOUND_ERROR_CODE).send({
          message: 'Пользователь с таким id не найден',
        });
        return;
      }

      if (err instanceof mongooseError.ValidationError) {
        res.status(NOT_VALID_ERROR_CODE).send({
          message: 'Переданы некорректные данные',
        });
        return;
      }

      res.status(SERVER_ERROR_CODE).send({
        message: `Произошла ошибка ${err.message}`,
        err,
      });
    });
}

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;

  updateUser(req.user._id, { name, about }, res);
};

// Update avatar
module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  updateUser(req.user._id, { avatar }, res);
};
