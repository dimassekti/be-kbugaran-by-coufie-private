class ParticipantCheckupsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    this.postCheckupHandler = this.postCheckupHandler.bind(this);
    this.getEventCheckupsHandler = this.getEventCheckupsHandler.bind(this);
    this.getCheckupByUserHandler = this.getCheckupByUserHandler.bind(this);
    this.putCheckupHandler = this.putCheckupHandler.bind(this);
    this.deleteCheckupHandler = this.deleteCheckupHandler.bind(this);
    this.getUserCheckupsHandler = this.getUserCheckupsHandler.bind(this);
    this.putCheckupApprovalHandler = this.putCheckupApprovalHandler.bind(this);
  }

  async postCheckupHandler(request, h) {
    this._validator.validateCheckupPayload(request.payload);
    const { eventId } = request.params;
    const {
      userId,
      bloodPressureSystolic,
      bloodPressureDiastolic,
      heartRate,
      weight,
      height,
      medicalConditions,
      medications,
      fitnessLevel,
      checkedBy,
    } = request.payload;

    const checkupId = await this._service.addCheckup({
      eventId,
      userId,
      bloodPressureSystolic,
      bloodPressureDiastolic,
      heartRate,
      weight,
      height,
      medicalConditions,
      medications,
      fitnessLevel,
      checkedBy,
    });

    const response = h.response({
      status: "success",
      data: { checkupId },
    });
    response.code(201);
    return response;
  }

  async getEventCheckupsHandler(request) {
    const { eventId } = request.params;
    const checkups = await this._service.getEventCheckups(eventId);
    return {
      status: "success",
      data: { checkups },
    };
  }

  async getCheckupByUserHandler(request) {
    const { eventId, userId } = request.params;
    const checkup = await this._service.getCheckupByUserAndEvent(
      eventId,
      userId
    );
    return {
      status: "success",
      data: { checkup },
    };
  }

  async putCheckupHandler(request) {
    this._validator.validateCheckupPayload(request.payload);
    const { eventId, userId } = request.params;
    const {
      bloodPressureSystolic,
      bloodPressureDiastolic,
      heartRate,
      weight,
      height,
      medicalConditions,
      medications,
      fitnessLevel,
      checkedBy,
    } = request.payload;

    await this._service.updateCheckup(eventId, userId, {
      bloodPressureSystolic,
      bloodPressureDiastolic,
      heartRate,
      weight,
      height,
      medicalConditions,
      medications,
      fitnessLevel,
      checkedBy,
    });

    return {
      status: "success",
      message: "Checkup berhasil diperbarui",
    };
  }

  async deleteCheckupHandler(request) {
    const { eventId, userId } = request.params;
    await this._service.deleteCheckup(eventId, userId);
    return {
      status: "success",
      message: "Checkup berhasil dihapus",
    };
  }

  async getUserCheckupsHandler(request) {
    const { userId } = request.params;
    const checkups = await this._service.getUserCheckups(userId);
    return {
      status: "success",
      data: { checkups },
    };
  }

  async putCheckupApprovalHandler(request) {
    this._validator.validateCheckupApprovalPayload(request.payload);
    const { checkupId } = request.params;
    const { isApproved, approvalNotes } = request.payload;

    await this._service.updateApprovalStatus(
      checkupId,
      isApproved,
      approvalNotes
    );
    return {
      status: "success",
      message: "Status approval checkup berhasil diperbarui",
    };
  }
}

module.exports = ParticipantCheckupsHandler;
