const {
  requireStaffOrAdmin,
  requireAdminRole,
} = require("../../helpers/authorization");

const routes = (handler) => [
  {
    method: "POST",
    path: "/hospitals",
    handler: handler.postHospitalHandler,
    options: {
      auth: "app_jwt",
      pre: [requireStaffOrAdmin()],
    },
  },
  {
    method: "GET",
    path: "/hospitals",
    handler: handler.getHospitalsHandler,
  },
  {
    method: "GET",
    path: "/hospitals/{id}",
    handler: handler.getHospitalByIdHandler,
  },
  {
    method: "PUT",
    path: "/hospitals/{id}",
    handler: handler.putHospitalByIdHandler,
    options: {
      auth: "app_jwt",
      pre: [requireStaffOrAdmin()],
    },
  },
  {
    method: "DELETE",
    path: "/hospitals/{id}",
    handler: handler.deleteHospitalByIdHandler,
    options: {
      auth: "app_jwt",
      pre: [requireAdminRole()],
    },
  },
  {
    method: "POST",
    path: "/hospitals/{id}/staff",
    handler: handler.postHospitalStaffHandler,
    options: {
      auth: "app_jwt",
      pre: [requireStaffOrAdmin()],
    },
  },
  {
    method: "GET",
    path: "/hospitals/{id}/staff",
    handler: handler.getHospitalStaffHandler,
  },
  {
    method: "DELETE",
    path: "/hospitals/{id}/staff/{staffId}",
    handler: handler.deleteHospitalStaffHandler,
    options: {
      auth: "app_jwt",
      pre: [requireStaffOrAdmin()],
    },
  },
];

module.exports = routes;
