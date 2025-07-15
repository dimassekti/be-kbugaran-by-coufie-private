const ParticipantCheckupsHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "participantCheckups",
  version: "1.0.0",
  register: async (server, { service, validator }) => {
    const participantCheckupsHandler = new ParticipantCheckupsHandler(
      service,
      validator
    );
    server.route(routes(participantCheckupsHandler));
  },
};
