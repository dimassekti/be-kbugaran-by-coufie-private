const AuthorizationError = require("../exceptions/AuthorizationError");

/**
 * Authorization helpers for Hapi.js routes
 */

const requireRole = (...allowedRoles) => ({
  method: (request, h) => {
    const { credentials } = request.auth;

    if (!credentials || !credentials.role) {
      throw new AuthorizationError("Access denied: Authentication required");
    }

    if (!allowedRoles.includes(credentials.role)) {
      throw new AuthorizationError("Access denied: Insufficient permissions");
    }

    return h.continue;
  },
  assign: "roleCheck",
});

const requireAuth = () => ({
  method: (request, h) => {
    const { credentials } = request.auth;

    if (!credentials || !credentials.id) {
      throw new AuthorizationError("Access denied: Authentication required");
    }

    return h.continue;
  },
  assign: "authCheck",
});

const requireAdminRole = () => requireRole("admin");

const requireStaffOrAdmin = () => requireRole("staff", "admin");

module.exports = {
  requireRole,
  requireAuth,
  requireAdminRole,
  requireStaffOrAdmin,
};
