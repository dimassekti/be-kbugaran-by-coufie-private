const Jwt = require("@hapi/jwt");
const InvariantError = require("../exceptions/InvariantError");

const TokenManager = {
  generateAccessToken: (payload) => {
    // Ensure backward compatibility - if payload only has id, keep it as is
    // If payload has both id and role, use both
    const tokenPayload = payload.role
      ? { id: payload.id, role: payload.role }
      : payload;
    return Jwt.token.generate(tokenPayload, process.env.ACCESS_TOKEN_KEY);
  },
  generateRefreshToken: (payload) => {
    // Ensure backward compatibility - if payload only has id, keep it as is
    // If payload has both id and role, use both
    const tokenPayload = payload.role
      ? { id: payload.id, role: payload.role }
      : payload;
    return Jwt.token.generate(tokenPayload, process.env.REFRESH_TOKEN_KEY);
  },
  verifyRefreshToken: (refreshToken) => {
    try {
      const artifacts = Jwt.token.decode(refreshToken);
      Jwt.token.verifySignature(artifacts, process.env.REFRESH_TOKEN_KEY);
      const { payload } = artifacts.decoded;
      return payload;
    } catch (error) {
      throw new InvariantError("Refresh token tidak valid");
    }
  },
};

module.exports = TokenManager;
