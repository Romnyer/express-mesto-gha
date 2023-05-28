const Card = require('../models/card');
const {
  NOT_VALID_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  SERVER_ERROR_CODE,
} = require('../errors/errors');

// All cards route
module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.status(201).send({ cards });
    })
    .catch((err) => {
      res.status(SERVER_ERROR_CODE).send({
        message: `Произошла ошибка${err.message}`,
      });
    });
};

// Create card
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(201).send(card);
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

// Delete card
module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND_ERROR_CODE).send({
          message: 'Карточка с таким id не найдена',
        });
        return;
      }
      res.status(201).send({ card });
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

// Like card
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND_ERROR_CODE).send({
          message: 'Карточка с таким id не найдена',
        });
        return;
      }
      res.status(201).send(card);
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

// Dislike card
module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND_ERROR_CODE).send({
          message: 'Карточка с таким id не найдена',
        });
        return;
      }
      res.status(201).send(card);
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
