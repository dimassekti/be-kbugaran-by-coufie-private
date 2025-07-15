const CheckupReviewersHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'checkupReviewers',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const checkupReviewersHandler = new CheckupReviewersHandler(service, validator);
    server.route(routes(checkupReviewersHandler));
  },
};
