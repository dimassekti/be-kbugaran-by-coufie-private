const InvariantError = require("../../exceptions/InvariantError");
const { UserPayloadSchema, UserRoleUpdateSchema } = require("./schema");

const UsersValidator = {
  validateUserPayload: (payload) => {
    const validationResult = UserPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateUserRoleUpdatePayload: (payload) => {
    const validationResult = UserRoleUpdateSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};
module.exports = UsersValidator;
