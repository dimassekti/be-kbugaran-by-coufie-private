const InvariantError = require("../../exceptions/InvariantError");
const {
  CheckupPayloadSchema,
  CheckupApprovalPayloadSchema,
} = require("./schema");

const ParticipantCheckupsValidator = {
  validateCheckupPayload: (payload) => {
    const validationResult = CheckupPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateCheckupApprovalPayload: (payload) => {
    const validationResult = CheckupApprovalPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = ParticipantCheckupsValidator;
