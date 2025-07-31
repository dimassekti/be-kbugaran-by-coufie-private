const { requireAdminRole } = require("../../helpers/authorization");
const AuthorizationError = require("../../exceptions/AuthorizationError");

const routes = (handler) => [
  {
    method: "POST",
    path: "/users",
    handler: handler.postUserHandler,
    options: {
      auth: {
        mode: "try",
        strategy: "app_jwt",
      },
      pre: [
        {
          method: (request, h) => {
            // Require admin authentication only if role parameter is provided
            if (request.payload && request.payload.role) {
              if (!request.auth.isAuthenticated || !request.auth.credentials) {
                throw new AuthorizationError(
                  "Authentication required for role assignment"
                );
              }
              return requireAdminRole().method(request, h);
            }
            return h.continue;
          },
        },
      ],
    },
  },
  {
    method: "GET",
    path: "/users/me",
    handler: handler.getCurrentUserHandler,
    options: {
      auth: "app_jwt",
    },
  },
  {
    method: "GET",
    path: "/users/{id}",
    handler: handler.getUserByIdHandler,
  },
  {
    method: "GET",
    path: "/users",
    handler: handler.getAllUsersHandler,
    options: {
      auth: "app_jwt",
      pre: [requireAdminRole()],
    },
  },
  {
    method: "GET",
    path: "/users/username/{username}",
    handler: handler.getUserByUsernameHandler,
    options: {
      auth: "app_jwt",
    },
  },
  {
    method: "DELETE",
    path: "/users/{id}",
    handler: handler.deleteUserHandler,
    options: {
      auth: "app_jwt",
      pre: [requireAdminRole()],
    },
  },
  {
    method: "PUT",
    path: "/users/{id}/role",
    handler: handler.updateUserRoleHandler,
    options: {
      auth: "app_jwt",
      pre: [requireAdminRole()],
    },
  },
];

module.exports = routes;
