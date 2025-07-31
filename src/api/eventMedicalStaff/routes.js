const { requireStaffOrAdmin } = require("../../helpers/authorization");

const routes = (handler) => [
  {
    method: "POST",
    path: "/events/{eventId}/medical-staff",
    handler: handler.postEventMedicalStaffHandler,
    options: {
      auth: "app_jwt",
      pre: [requireStaffOrAdmin()],
    },
  },
  {
    method: "GET",
    path: "/events/{eventId}/medical-staff",
    handler: handler.getEventMedicalStaffHandler,
  },
  {
    method: "DELETE",
    path: "/events/{eventId}/medical-staff/{staffId}",
    handler: handler.deleteEventMedicalStaffHandler,
    options: {
      auth: "app_jwt",
      pre: [requireStaffOrAdmin()],
    },
  },
  {
    method: "GET",
    path: "/events/{eventId}/available-staff",
    handler: handler.getAvailableStaffForEventHandler,
    options: {
      auth: "app_jwt",
      pre: [requireStaffOrAdmin()],
    },
  },
];

module.exports = routes;
