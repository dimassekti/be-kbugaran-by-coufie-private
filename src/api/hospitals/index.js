const HospitalsHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "hospitals",
  version: "1.0.0",
  register: async (
    server,
    { hospitalsService, hospitalMedicalStaffService, validator }
  ) => {
    const hospitalsHandler = new HospitalsHandler(
      hospitalsService,
      hospitalMedicalStaffService,
      validator
    );
    server.route(routes(hospitalsHandler));
  },
};
