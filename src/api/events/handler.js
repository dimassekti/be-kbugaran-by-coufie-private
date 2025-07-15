class EventsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    this.postEventHandler = this.postEventHandler.bind(this);
    this.getEventsHandler = this.getEventsHandler.bind(this);
    this.getEventByIdHandler = this.getEventByIdHandler.bind(this);
    this.putEventByIdHandler = this.putEventByIdHandler.bind(this);
    this.deleteEventHandler = this.deleteEventHandler.bind(this);
  }

  async postEventHandler(request, h) {
    this._validator.validateEventPayload(request.payload);
    const { name, date, description } = request.payload;
    const eventId = await this._service.addEvent({ name, date, description });
    const response = h.response({
      status: "success",
      data: { eventId },
    });
    response.code(201);
    return response;
  }

  async getEventsHandler() {
    const events = await this._service.getEvents();
    return {
      status: "success",
      data: { events },
    };
  }

  async getEventByIdHandler(request) {
    const { id } = request.params;
    const event = await this._service.getEventById(id);
    return {
      status: "success",
      data: { event },
    };
  }

  async putEventByIdHandler(request) {
    this._validator.validateEventPayload(request.payload);
    const { id } = request.params;
    const { name, date, description } = request.payload;
    await this._service.editEventById(id, { name, date, description });
    return {
      status: "success",
      message: "Event berhasil diperbarui",
    };
  }

  async deleteEventHandler(request) {
    const { id } = request.params;
    await this._service.deleteEventById(id);
    return {
      status: "success",
      message: "Event berhasil dihapus",
    };
  }
}

module.exports = EventsHandler;
