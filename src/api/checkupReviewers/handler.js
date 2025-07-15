class CheckupReviewersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    this.postReviewerHandler = this.postReviewerHandler.bind(this);
    this.getReviewersHandler = this.getReviewersHandler.bind(this);
    this.getActiveReviewersHandler = this.getActiveReviewersHandler.bind(this);
    this.getReviewerByIdHandler = this.getReviewerByIdHandler.bind(this);
    this.putReviewerHandler = this.putReviewerHandler.bind(this);
    this.putReviewerStatusHandler = this.putReviewerStatusHandler.bind(this);
    this.deleteReviewerHandler = this.deleteReviewerHandler.bind(this);
    this.getReviewerByUserHandler = this.getReviewerByUserHandler.bind(this);
  }

  async postReviewerHandler(request, h) {
    this._validator.validateReviewerPayload(request.payload);
    const {
      userId,
      name,
      degree,
      specialization,
      contactPhone,
      contactEmail,
    } = request.payload;

    const reviewerId = await this._service.addReviewer({
      userId,
      name,
      degree,
      specialization,
      contactPhone,
      contactEmail,
    });

    const response = h.response({
      status: 'success',
      data: { reviewerId },
    });
    response.code(201);
    return response;
  }

  async getReviewersHandler() {
    const reviewers = await this._service.getReviewers();
    return {
      status: 'success',
      data: { reviewers },
    };
  }

  async getActiveReviewersHandler() {
    const reviewers = await this._service.getActiveReviewers();
    return {
      status: 'success',
      data: { reviewers },
    };
  }

  async getReviewerByIdHandler(request) {
    const { id } = request.params;
    const reviewer = await this._service.getReviewerById(id);
    return {
      status: 'success',
      data: { reviewer },
    };
  }

  async putReviewerHandler(request) {
    this._validator.validateReviewerPayload(request.payload);
    const { id } = request.params;
    const {
      name,
      degree,
      specialization,
      contactPhone,
      contactEmail,
    } = request.payload;

    await this._service.updateReviewer(id, {
      name,
      degree,
      specialization,
      contactPhone,
      contactEmail,
    });

    return {
      status: 'success',
      message: 'Reviewer berhasil diperbarui',
    };
  }

  async putReviewerStatusHandler(request) {
    this._validator.validateReviewerStatusPayload(request.payload);
    const { id } = request.params;
    const { isActive } = request.payload;

    await this._service.toggleReviewerStatus(id, isActive);
    return {
      status: 'success',
      message: `Reviewer berhasil ${isActive ? 'diaktifkan' : 'dinonaktifkan'}`,
    };
  }

  async deleteReviewerHandler(request) {
    const { id } = request.params;
    await this._service.deleteReviewer(id);
    return {
      status: 'success',
      message: 'Reviewer berhasil dihapus',
    };
  }

  async getReviewerByUserHandler(request) {
    const { userId } = request.params;
    const reviewer = await this._service.getReviewerByUserId(userId);
    return {
      status: 'success',
      data: { reviewer },
    };
  }
}

module.exports = CheckupReviewersHandler;
