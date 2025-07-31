const EventMedicalStaffHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "eventMedicalStaff",
  version: "1.0.0",
  register: async (server, { eventMedicalStaffService, validator }) => {
    const eventMedicalStaffHandler = new EventMedicalStaffHandler(
      eventMedicalStaffService,
      validator
    );
    server.route(routes(eventMedicalStaffHandler));
  },
};
