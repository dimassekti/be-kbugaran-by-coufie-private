const InvariantError = require("../../exceptions/InvariantError");
const { EventPayloadSchema } = require("./schema");

const EventsValidator = {
  validateEventPayload: (payload) => {
    const validationResult = EventPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = EventsValidator;
