const routes = (handler) => [
  {
    method: "POST",
    path: "/checkups/{checkupId}/results",
    handler: handler.postCheckupResultHandler,
  },
  {
    method: "GET",
    path: "/checkups/{checkupId}/results",
    handler: handler.getCheckupResultHandler,
  },
  {
    method: "PUT",
    path: "/results/{resultId}",
    handler: handler.putCheckupResultHandler,
  },
  {
    method: "GET",
    path: "/events/{eventId}/checkup-results",
    handler: handler.getEventCheckupResultsHandler,
  },
  {
    method: "GET",
    path: "/events/{eventId}/checkup-results/status",
    handler: handler.getResultsByStatusHandler,
  },
];

module.exports = routes;
