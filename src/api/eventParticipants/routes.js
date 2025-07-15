const routes = (handler) => [
  {
    method: "POST",
    path: "/events/{eventId}/participants",
    handler: handler.postEventParticipantHandler,
  },
  {
    method: "GET",
    path: "/events/{eventId}/participants",
    handler: handler.getEventParticipantsHandler,
  },
  {
    method: "GET",
    path: "/events/{eventId}/participants/{userId}",
    handler: handler.getParticipantByUserHandler,
  },
  {
    method: "PUT",
    path: "/events/{eventId}/participants/{userId}",
    handler: handler.putParticipantStatusHandler,
  },
  {
    method: "DELETE",
    path: "/events/{eventId}/participants/{userId}",
    handler: handler.deleteEventParticipantHandler,
  },
  {
    method: "GET",
    path: "/users/{userId}/events",
    handler: handler.getUserEventsHandler,
  },
];

module.exports = routes;
