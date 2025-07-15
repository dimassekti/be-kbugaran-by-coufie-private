const InvariantError = require('../../exceptions/InvariantError');
const { ReviewerPayloadSchema, ReviewerStatusPayloadSchema } = require('./schema');

const CheckupReviewersValidator = {
  validateReviewerPayload: (payload) => {
    const validationResult = ReviewerPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateReviewerStatusPayload: (payload) => {
    const validationResult = ReviewerStatusPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = CheckupReviewersValidator;
