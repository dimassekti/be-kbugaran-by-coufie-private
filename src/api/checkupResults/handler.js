class CheckupResultsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    this.postCheckupResultHandler = this.postCheckupResultHandler.bind(this);
    this.getCheckupResultHandler = this.getCheckupResultHandler.bind(this);
    this.putCheckupResultHandler = this.putCheckupResultHandler.bind(this);
    this.getEventCheckupResultsHandler =
      this.getEventCheckupResultsHandler.bind(this);
    this.getResultsByStatusHandler = this.getResultsByStatusHandler.bind(this);
  }

  async postCheckupResultHandler(request, h) {
    this._validator.validateCheckupResultPayload(request.payload);
    const { checkupId } = request.params;
    const {
      resultStatus,
      organizerNotes,
      healthConcerns,
      restrictions,
      recommendations,
      reviewedBy,
    } = request.payload;

    const resultId = await this._service.addCheckupResult({
      participantCheckupId: checkupId,
      resultStatus,
      organizerNotes,
      healthConcerns,
      restrictions,
      recommendations,
      reviewedBy,
    });

    const response = h.response({
      status: "success",
      data: { resultId },
    });
    response.code(201);
    return response;
  }

  async getCheckupResultHandler(request) {
    const { checkupId } = request.params;
    const result = await this._service.getCheckupResult(checkupId);
    return {
      status: "success",
      data: { result },
    };
  }

  async putCheckupResultHandler(request) {
    this._validator.validateCheckupResultPayload(request.payload);
    const { resultId } = request.params;
    const {
      resultStatus,
      organizerNotes,
      healthConcerns,
      restrictions,
      recommendations,
      reviewedBy,
    } = request.payload;

    await this._service.updateCheckupResult(resultId, {
      resultStatus,
      organizerNotes,
      healthConcerns,
      restrictions,
      recommendations,
      reviewedBy,
    });

    return {
      status: "success",
      message: "Checkup result berhasil diperbarui",
    };
  }

  async getEventCheckupResultsHandler(request) {
    const { eventId } = request.params;
    const results = await this._service.getEventCheckupResults(eventId);
    return {
      status: "success",
      data: { results },
    };
  }

  async getResultsByStatusHandler(request) {
    const { eventId } = request.params;
    const { status } = request.query;
    const results = await this._service.getResultsByStatus(eventId, status);
    return {
      status: "success",
      data: { results },
    };
  }
}

module.exports = CheckupResultsHandler;
