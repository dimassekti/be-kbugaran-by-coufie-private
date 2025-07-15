const InvariantError = require("../../exceptions/InvariantError");
const { CheckupResultPayloadSchema } = require("./schema");

const CheckupResultsValidator = {
  validateCheckupResultPayload: (payload) => {
    const validationResult = CheckupResultPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = CheckupResultsValidator;
