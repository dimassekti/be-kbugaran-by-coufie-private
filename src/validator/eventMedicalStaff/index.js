const InvariantError = require("../../exceptions/InvariantError");
const { EventMedicalStaffPayloadSchema } = require("./schema");

const EventMedicalStaffValidator = {
  validateEventMedicalStaffPayload: (payload) => {
    const validationResult = EventMedicalStaffPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = EventMedicalStaffValidator;
