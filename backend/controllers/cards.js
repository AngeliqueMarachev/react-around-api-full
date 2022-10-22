const Card = require("../models/cards");

const NotFoundError = require("../errors/notFoundError");
const BadRequestError = require("../errors/badRequest");

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      if (!cards) {
        return next(new NotFoundError("Nothing to display"));
      }
      res.status(200).send({ data: cards });
    })
    .catch((err) => console.log(err));
};

// POST
const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({
    name,
    link,
    owner,
  })
    .then((card) => {
      if (!card) {
        throw new BadRequestError("Bad request");
      }
      res.status(201).send({ data: card });
    })
};

// DELETE
const deleteCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findById(cardId);
  orFail()
    .then((card) => {
      if (!card) {
        throw new NotFoundError("No card with matching ID found");
      }
      if (!card.owner._id.equals(req.user._id)) {
        throw new Error("Access denied");
      }
      Card.findByIdAndRemove({ cardId });
      orFail().then((card) => {
        res.status(200).send({ data: card });
      });
    })
    .catch((err) => {
      console.log(err);
      if (err.name === "Error") {
        res.status(403).send({ message: `${err.message}` });
      }
      if (err.name === "CastError") {
        throw new BadRequestError("Bad request");
      }
      next(err);
    })
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((card) => {
      if (!card) {
        throw new NotFoundError("No card with matching ID");
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      console.log(err);
      if (err.name === "CastError") {
        throw new BadRequestError("Bad request");
      }
      next(err);
    })
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {

        throw new NotFoundError("No card with matching ID");
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      console.log(err);
      if (err.name === "CastError") {
        throw new BadRequestError("Bad request");
      }
      next(err);
    })
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
