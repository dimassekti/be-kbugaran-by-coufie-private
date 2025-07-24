const {
  requireStaffOrAdmin,
  requireAdminRole,
} = require("../../helpers/authorization");

const routes = (handler) => [
  {
    method: "POST",
    path: "/events",
    handler: handler.postEventHandler,
    options: {
      auth: "app_jwt",
      pre: [requireStaffOrAdmin()],
    },
  },
  {
    method: "GET",
    path: "/events",
    handler: handler.getEventsHandler,
  },
  {
    method: "GET",
    path: "/events/{id}",
    handler: handler.getEventByIdHandler,
  },
  {
    method: "PUT",
    path: "/events/{id}",
    handler: handler.putEventByIdHandler,
    options: {
      auth: "app_jwt",
      pre: [requireStaffOrAdmin()],
    },
  },
  {
    method: "DELETE",
    path: "/events/{id}",
    handler: handler.deleteEventHandler,
    options: {
      auth: "app_jwt",
      pre: [requireAdminRole()],
    },
  },
];

module.exports = routes;
