const SERVER_ERROR = (res) => res.status(500).send({ message: 'We have encountered an error' });

const PAGE_ERROR = 404;
const INVALID_DATA = 400;

module.exports = {
  SERVER_ERROR,
  PAGE_ERROR,
  INVALID_DATA,
};
