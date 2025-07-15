const routes = (handler) => [
  {
    method: 'POST',
    path: '/reviewers',
    handler: handler.postReviewerHandler,
  },
  {
    method: 'GET',
    path: '/reviewers',
    handler: handler.getReviewersHandler,
  },
  {
    method: 'GET',
    path: '/reviewers/active',
    handler: handler.getActiveReviewersHandler,
  },
  {
    method: 'GET',
    path: '/reviewers/{id}',
    handler: handler.getReviewerByIdHandler,
  },
  {
    method: 'PUT',
    path: '/reviewers/{id}',
    handler: handler.putReviewerHandler,
  },
  {
    method: 'PUT',
    path: '/reviewers/{id}/status',
    handler: handler.putReviewerStatusHandler,
  },
  {
    method: 'DELETE',
    path: '/reviewers/{id}',
    handler: handler.deleteReviewerHandler,
  },
  {
    method: 'GET',
    path: '/users/{userId}/reviewer',
    handler: handler.getReviewerByUserHandler,
  },
];

module.exports = routes;
