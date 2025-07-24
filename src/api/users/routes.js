const { requireAdminRole } = require("../../helpers/authorization");

const routes = (handler) => [
  {
    method: "POST",
    path: "/users",
    handler: handler.postUserHandler,
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
