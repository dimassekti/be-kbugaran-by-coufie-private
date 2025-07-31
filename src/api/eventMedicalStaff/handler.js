class EventMedicalStaffHandler {
  constructor(eventMedicalStaffService, validator) {
    this._eventMedicalStaffService = eventMedicalStaffService;
    this._validator = validator;

    this.postEventMedicalStaffHandler =
      this.postEventMedicalStaffHandler.bind(this);
    this.getEventMedicalStaffHandler =
      this.getEventMedicalStaffHandler.bind(this);
    this.deleteEventMedicalStaffHandler =
      this.deleteEventMedicalStaffHandler.bind(this);
    this.getAvailableStaffForEventHandler =
      this.getAvailableStaffForEventHandler.bind(this);
  }

  async postEventMedicalStaffHandler(request, h) {
    this._validator.validateEventMedicalStaffPayload(request.payload);
    const { eventId } = request.params;
    const payload = { ...request.payload, eventId };

    const assignmentId =
      await this._eventMedicalStaffService.assignStaffToEvent(payload);

    const response = h.response({
      status: "success",
      message: "Medical staff berhasil ditugaskan ke event",
      data: {
        assignmentId,
      },
    });
    response.code(201);
    return response;
  }

  async getEventMedicalStaffHandler(request) {
    const { eventId } = request.params;
    const medicalStaff =
      await this._eventMedicalStaffService.getEventMedicalStaff(eventId);

    return {
      status: "success",
      data: {
        medicalStaff,
      },
    };
  }

  async deleteEventMedicalStaffHandler(request) {
    const { staffId } = request.params;
    await this._eventMedicalStaffService.removeStaffFromEvent(staffId);

    return {
      status: "success",
      message: "Medical staff berhasil dihapus dari event",
    };
  }

  async getAvailableStaffForEventHandler(request) {
    const { eventId } = request.params;
    const availableStaff =
      await this._eventMedicalStaffService.getAvailableStaffForEvent(eventId);

    return {
      status: "success",
      data: {
        availableStaff,
      },
    };
  }
}

module.exports = EventMedicalStaffHandler;
