const EventsHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "events",
  version: "1.0.0",
  register: async (server, { service, validator }) => {
    const eventsHandler = new EventsHandler(service, validator);
    server.route(routes(eventsHandler));
  },
};
