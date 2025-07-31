const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const {
  softDeleteCondition,
  applySoftDelete,
} = require("../../utils/softDelete");

class HospitalMedicalStaffService {
  constructor() {
    this._pool = new Pool();
  }

  async addStaffToHospital({
    hospitalId,
    userId,
    staffRole,
    specialization,
    licenseNumber,
    yearsOfExperience,
  }) {
    // Check if user is already assigned to this hospital
    const checkQuery = {
      text: `SELECT id FROM hospital_medical_staff 
             WHERE hospital_id = $1 AND user_id = $2 AND ${softDeleteCondition()}`,
      values: [hospitalId, userId],
    };

    const checkResult = await this._pool.query(checkQuery);
    if (checkResult.rows.length > 0) {
      throw new InvariantError(
        "User sudah terdaftar sebagai staff di hospital ini"
      );
    }

    const id = `hospital-staff-${nanoid(16)}`;

    const query = {
      text: `INSERT INTO hospital_medical_staff 
             VALUES($1, $2, $3, $4, $5, $6, $7, true, NOW(), NOW(), NOW(), NULL) 
             RETURNING id`,
      values: [
        id,
        hospitalId,
        userId,
        staffRole,
        specialization,
        licenseNumber,
        yearsOfExperience,
      ],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("Staff gagal ditambahkan ke hospital");
    }

    return result.rows[0].id;
  }

  async getHospitalStaff(hospitalId) {
    const query = {
      text: `SELECT hms.id, hms.hospital_id, hms.user_id, hms.staff_role, 
                    hms.specialization, hms.license_number, hms.years_of_experience, 
                    hms.is_active, hms.assigned_date, hms.created_at, hms.updated_at,
                    u.username, u.fullname
             FROM hospital_medical_staff hms
             JOIN users u ON hms.user_id = u.id
             WHERE hms.hospital_id = $1 AND hms.${softDeleteCondition()} AND u.${softDeleteCondition()}
             ORDER BY hms.assigned_date DESC`,
      values: [hospitalId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async getStaffByHospitalAndUser(hospitalId, userId) {
    const query = {
      text: `SELECT hms.id, hms.hospital_id, hms.user_id, hms.staff_role, 
                    hms.specialization, hms.license_number, hms.years_of_experience, 
                    hms.is_active, hms.assigned_date, hms.created_at, hms.updated_at,
                    u.username, u.fullname
             FROM hospital_medical_staff hms
             JOIN users u ON hms.user_id = u.id
             WHERE hms.hospital_id = $1 AND hms.user_id = $2 AND hms.${softDeleteCondition()} AND u.${softDeleteCondition()}`,
      values: [hospitalId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Staff tidak ditemukan di hospital ini");
    }

    return result.rows[0];
  }

  async getStaffById(staffId) {
    const query = {
      text: `SELECT hms.id, hms.hospital_id, hms.user_id, hms.staff_role, 
                    hms.specialization, hms.license_number, hms.years_of_experience, 
                    hms.is_active, hms.assigned_date, hms.created_at, hms.updated_at,
                    u.username, u.fullname, h.name as hospital_name
             FROM hospital_medical_staff hms
             JOIN users u ON hms.user_id = u.id
             JOIN hospitals h ON hms.hospital_id = h.id
             WHERE hms.id = $1 AND hms.${softDeleteCondition()} AND u.${softDeleteCondition()} AND h.${softDeleteCondition()}`,
      values: [staffId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Staff tidak ditemukan");
    }

    return result.rows[0];
  }

  async removeStaffFromHospital(staffId) {
    await applySoftDelete(this._pool, "hospital_medical_staff", staffId);
  }
}

module.exports = HospitalMedicalStaffService;
