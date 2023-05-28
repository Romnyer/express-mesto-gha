const Card = require('../models/card');

//All cards route
module.exports.getCards = (req, res) => {
  Card.find({})
    .then(cards => {
      res.status(201).send(cards)
    })
    .catch(err => {
      res.status(500).send({
        message: err.message
      })
    })
};

//Create card
module.exports.createCard = (req, res) => {
  const {name, link} = req.body;

  Card.create({name, link, owner: req.user._id})
    .then(card => {
      res.status(201).send(card)
    })
    .catch(err => {
      if (err.name === "ValidationError") {
        res.status(400).send({
          message: 'Переданы некорректные данные',
          err
        });
        return;
      }

      res.status(500).send({
        message: 'Произошла ошибка'
      })
    })
};

//Delete card
module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then(card => {
      res.status(201).send({card})
    })
    .catch(err => {
      if (err.name === "CastError") {
        res.status(404).send({
          message: 'Карточка не найдена'
        });
        return;
      }

      res.status(500).send({
        message: 'Произошла ошибка'
      })
    })
};

//Like card
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {$addToSet: {likes: req.user._id}},
    {new: true},
  )
    .then(card => {
      res.status(201).send(card)
    })
    .catch(err => {
      if (err.name === "CastError") {
        res.status(404).send({
          message: 'Карточка не найдена'
        });
        return;
      }

      res.status(500).send({
        message: 'Произошла ошибка'
      })
    })
};

//Dislike card
module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {$pull: {likes: req.user._id}},
    {new: true},
  )
    .then(card => {
      res.status(201).send(card)
    })
    .catch(err => {
      if (err.name === "CastError") {
        res.status(404).send({
          message: 'Карточка не найдена'
        });
        return;
      }

      res.status(500).send({
        message: 'Произошла ошибка'
      })
    })
};