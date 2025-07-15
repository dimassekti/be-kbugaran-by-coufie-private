const InvariantError = require("../../exceptions/InvariantError");
const {
  ParticipantPayloadSchema,
  ParticipantStatusPayloadSchema,
} = require("./schema");

const EventParticipantsValidator = {
  validateParticipantPayload: (payload) => {
    const validationResult = ParticipantPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateParticipantStatusPayload: (payload) => {
    const validationResult = ParticipantStatusPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = EventParticipantsValidator;
