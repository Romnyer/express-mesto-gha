const mongooseError = require('mongoose').Error;

const Card = require('../models/card');

const {
  OK_STATUS_CODE,
  CREATED_STATUS_CODE,
} = require('../constants/constants');

const NotFoundError = require('../errors/notFoundError');
const BadRequestError = require('../errors/badRequestError');
const ForbiddenError = require('../errors/forbiddenError');
// All cards route
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.status(OK_STATUS_CODE).send({ cards });
    })
    .catch(next);
};

// Create card
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(CREATED_STATUS_CODE).send(card);
    })
    .catch((err) => {
      if (err instanceof mongooseError.ValidationError) {
        next(new BadRequestError('Переданы некорректные данные'));
        return;
      }

      next(err);
    });
};

// Delete card
module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card.owner !== req.user._id) {
        throw new ForbiddenError('Вы можете удалять только свои карточки');
      }

      if (!card) {
        throw new NotFoundError('Карточка с таким id не найдена');
      }

      res.status(OK_STATUS_CODE).send({ card });
    })
    .catch((err) => {
      if (err instanceof mongooseError.CastError) {
        next(new BadRequestError('Переданы некорректные данные'));
        return;
      }

      next(err);
    });
};

// Like card
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с таким id не найдена');
      }

      res.status(CREATED_STATUS_CODE).send(card);
    })
    .catch((err) => {
      if (err instanceof mongooseError.CastError) {
        next(new BadRequestError('Переданы некорректные данные'));
        return;
      }

      next(err);
    });
};

// Dislike card
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с таким id не найдена');
      }

      res.status(OK_STATUS_CODE).send(card);
    })
    .catch((err) => {
      if (err instanceof mongooseError.CastError) {
        next(new BadRequestError('Переданы некорректные данные'));
        return;
      }

      next(err);
    });
};
