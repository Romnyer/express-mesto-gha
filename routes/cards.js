const cardRouter = require('express').Router();

const {getCards,
      createCard,
      deleteCard,
      likeCard,
      dislikeCard} = require('../controllers/cards');

//Get all cards
cardRouter.get('/', getCards);

//Create card
cardRouter.post('/', createCard);

//Delete card
cardRouter.delete('/:cardId', deleteCard);

//Like card
cardRouter.put('/:cardId/likes', likeCard);

//Dislike card
cardRouter.delete('/:cardId/likes', dislikeCard);

module.exports = cardRouter;