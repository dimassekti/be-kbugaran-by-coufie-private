class EventParticipantsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    this.postEventParticipantHandler =
      this.postEventParticipantHandler.bind(this);
    this.getEventParticipantsHandler =
      this.getEventParticipantsHandler.bind(this);
    this.getParticipantByUserHandler =
      this.getParticipantByUserHandler.bind(this);
    this.getParticipantByIdHandler = this.getParticipantByIdHandler.bind(this);
    this.putParticipantStatusHandler =
      this.putParticipantStatusHandler.bind(this);
    this.deleteEventParticipantHandler =
      this.deleteEventParticipantHandler.bind(this);
    this.getUserEventsHandler = this.getUserEventsHandler.bind(this);
    this.joinEventHandler = this.joinEventHandler.bind(this);
  }

  async postEventParticipantHandler(request, h) {
    this._validator.validateParticipantPayload(request.payload);
    const { eventId } = request.params;
    const { userId, role } = request.payload;

    const result = await this._service.addParticipant({
      eventId,
      userId,
      role,
    });
    const response = h.response({
      status: "success",
      data: {
        participantId: result.id,
        participantCode: result.participantCode,
      },
    });
    response.code(201);
    return response;
  }

  async getEventParticipantsHandler(request) {
    const { eventId } = request.params;
    const participants = await this._service.getEventParticipants(eventId);
    return {
      status: "success",
      data: { participants },
    };
  }

  async getParticipantByUserHandler(request) {
    const { eventId, userId } = request.params;
    const participant = await this._service.getParticipantByUserAndEvent(
      eventId,
      userId
    );
    return {
      status: "success",
      data: { participant },
    };
  }

  async getParticipantByIdHandler(request) {
    const { participantId } = request.params;
    const participant = await this._service.getParticipantById(participantId);
    return {
      status: "success",
      data: { participant },
    };
  }

  async putParticipantStatusHandler(request) {
    this._validator.validateParticipantStatusPayload(request.payload);
    const { eventId, userId } = request.params;
    const { status, notes } = request.payload;

    await this._service.updateParticipantStatus(eventId, userId, status, notes);
    return {
      status: "success",
      message: "Status participant berhasil diperbarui",
    };
  }

  async deleteEventParticipantHandler(request) {
    const { eventId, userId } = request.params;
    await this._service.removeParticipant(eventId, userId);
    return {
      status: "success",
      message: "Participant berhasil dihapus",
    };
  }

  async getUserEventsHandler(request) {
    const { userId } = request.params;
    const events = await this._service.getUserEvents(userId);
    return {
      status: "success",
      data: { events },
    };
  }

  async joinEventHandler(request, h) {
    const { eventId } = request.params;
    const { id: userId } = request.auth.credentials;

    const result = await this._service.joinEvent(eventId, userId);

    const response = h.response({
      status: "success",
      message: "Berhasil bergabung dengan event",
      data: {
        participantId: result.id,
        participantCode: result.participantCode,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = EventParticipantsHandler;
