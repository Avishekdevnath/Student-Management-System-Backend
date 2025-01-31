const moment = require('moment');

const formatDate = (date) => {
  return moment(date).format('YYYY-MM-DD');
};

const isPastDate = (date) => {
  return moment(date).isBefore(moment(), 'day');
};

module.exports = { formatDate, isPastDate };
