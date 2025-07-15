const routes = (handler) => [
  {
    method: "POST",
    path: "/events/{eventId}/checkups",
    handler: handler.postCheckupHandler,
  },
  {
    method: "GET",
    path: "/events/{eventId}/checkups",
    handler: handler.getEventCheckupsHandler,
  },
  {
    method: "GET",
    path: "/events/{eventId}/checkups/{userId}",
    handler: handler.getCheckupByUserHandler,
  },
  {
    method: "PUT",
    path: "/events/{eventId}/checkups/{userId}",
    handler: handler.putCheckupHandler,
  },
  {
    method: "DELETE",
    path: "/events/{eventId}/checkups/{userId}",
    handler: handler.deleteCheckupHandler,
  },
  {
    method: "GET",
    path: "/users/{userId}/checkups",
    handler: handler.getUserCheckupsHandler,
  },
  {
    method: "PUT",
    path: "/checkups/{checkupId}/approval",
    handler: handler.putCheckupApprovalHandler,
  },
];

module.exports = routes;
