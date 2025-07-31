class HospitalsHandler {
  constructor(hospitalsService, hospitalMedicalStaffService, validator) {
    this._hospitalsService = hospitalsService;
    this._hospitalMedicalStaffService = hospitalMedicalStaffService;
    this._validator = validator;

    this.postHospitalHandler = this.postHospitalHandler.bind(this);
    this.getHospitalsHandler = this.getHospitalsHandler.bind(this);
    this.getHospitalByIdHandler = this.getHospitalByIdHandler.bind(this);
    this.putHospitalByIdHandler = this.putHospitalByIdHandler.bind(this);
    this.deleteHospitalByIdHandler = this.deleteHospitalByIdHandler.bind(this);
    this.postHospitalStaffHandler = this.postHospitalStaffHandler.bind(this);
    this.getHospitalStaffHandler = this.getHospitalStaffHandler.bind(this);
    this.deleteHospitalStaffHandler =
      this.deleteHospitalStaffHandler.bind(this);
  }

  async postHospitalHandler(request, h) {
    this._validator.validateHospitalPayload(request.payload);
    const hospitalId = await this._hospitalsService.addHospital(
      request.payload
    );

    const response = h.response({
      status: "success",
      message: "Hospital berhasil ditambahkan",
      data: {
        hospitalId,
      },
    });
    response.code(201);
    return response;
  }

  async getHospitalsHandler() {
    const hospitals = await this._hospitalsService.getHospitals();
    return {
      status: "success",
      data: {
        hospitals,
      },
    };
  }

  async getHospitalByIdHandler(request) {
    const { id } = request.params;
    const hospital = await this._hospitalsService.getHospitalById(id);

    return {
      status: "success",
      data: {
        hospital,
      },
    };
  }

  async putHospitalByIdHandler(request) {
    this._validator.validateHospitalPayload(request.payload);
    const { id } = request.params;

    await this._hospitalsService.editHospitalById(id, request.payload);

    return {
      status: "success",
      message: "Hospital berhasil diperbarui",
    };
  }

  async deleteHospitalByIdHandler(request) {
    const { id } = request.params;
    await this._hospitalsService.deleteHospitalById(id);

    return {
      status: "success",
      message: "Hospital berhasil dihapus",
    };
  }

  async postHospitalStaffHandler(request, h) {
    const { id } = request.params;
    const payload = { ...request.payload, hospitalId: id };
    this._validator.validateHospitalStaffPayload(payload);

    const staffId = await this._hospitalMedicalStaffService.addStaffToHospital(
      payload
    );

    const response = h.response({
      status: "success",
      message: "Staff berhasil ditambahkan ke hospital",
      data: {
        staffId,
      },
    });
    response.code(201);
    return response;
  }

  async getHospitalStaffHandler(request) {
    const { id } = request.params;
    const staff = await this._hospitalMedicalStaffService.getHospitalStaff(id);

    return {
      status: "success",
      data: {
        staff,
      },
    };
  }

  async deleteHospitalStaffHandler(request) {
    const { staffId } = request.params;
    await this._hospitalMedicalStaffService.removeStaffFromHospital(staffId);

    return {
      status: "success",
      message: "Staff berhasil dihapus dari hospital",
    };
  }
}

module.exports = HospitalsHandler;
