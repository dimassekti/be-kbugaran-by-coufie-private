const CheckupResultsHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "checkupResults",
  version: "1.0.0",
  register: async (server, { service, validator }) => {
    const checkupResultsHandler = new CheckupResultsHandler(service, validator);
    server.route(routes(checkupResultsHandler));
  },
};
