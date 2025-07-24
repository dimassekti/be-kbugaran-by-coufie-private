const {
  requireStaffOrAdmin,
  requireAuth,
} = require("../../helpers/authorization");

const routes = (handler) => [
  {
    method: "POST",
    path: "/events/{eventId}/checkups",
    handler: handler.postCheckupHandler,
    options: {
      auth: "app_jwt",
      pre: [requireStaffOrAdmin()],
    },
  },
  {
    method: "GET",
    path: "/events/{eventId}/checkups",
    handler: handler.getEventCheckupsHandler,
    options: {
      auth: "app_jwt",
      pre: [requireAuth()],
    },
  },
  {
    method: "GET",
    path: "/events/{eventId}/checkups/{userId}",
    handler: handler.getCheckupByUserHandler,
    options: {
      auth: "app_jwt",
      pre: [requireAuth()],
    },
  },
  {
    method: "PUT",
    path: "/events/{eventId}/checkups/{userId}",
    handler: handler.putCheckupHandler,
    options: {
      auth: "app_jwt",
      pre: [requireStaffOrAdmin()],
    },
  },
  {
    method: "DELETE",
    path: "/events/{eventId}/checkups/{userId}",
    handler: handler.deleteCheckupHandler,
    options: {
      auth: "app_jwt",
      pre: [requireStaffOrAdmin()],
    },
  },
  {
    method: "GET",
    path: "/users/{userId}/checkups",
    handler: handler.getUserCheckupsHandler,
    options: {
      auth: "app_jwt",
      pre: [requireAuth()],
    },
  },
  {
    method: "PUT",
    path: "/checkups/{checkupId}/approval",
    handler: handler.putCheckupApprovalHandler,
    options: {
      auth: "app_jwt",
      pre: [requireStaffOrAdmin()],
    },
  },
];

module.exports = routes;
