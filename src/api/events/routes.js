const routes = (handler) => [
  {
    method: "POST",
    path: "/events",
    handler: handler.postEventHandler,
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
  },
  {
    method: "DELETE",
    path: "/events/{id}",
    handler: handler.deleteEventHandler,
  },
];

module.exports = routes;
