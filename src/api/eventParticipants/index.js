const EventParticipantsHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "eventParticipants",
  version: "1.0.0",
  register: async (server, { service, validator }) => {
    const eventParticipantsHandler = new EventParticipantsHandler(
      service,
      validator
    );
    server.route(routes(eventParticipantsHandler));
  },
};
