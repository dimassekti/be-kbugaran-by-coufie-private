const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const {
  notDeletedCondition,
  softDeleteQuery,
} = require("../../utils/softDelete");

class ParticipantCheckupsService {
  constructor() {
    this._pool = new Pool();
  }

  async addCheckup({
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
  }) {
    // Check if checkup already exists for this user and event
    const existingQuery = {
      text: "SELECT id FROM participant_checkups WHERE event_id = $1 AND user_id = $2",
      values: [eventId, userId],
    };

    const existingResult = await this._pool.query(existingQuery);
    if (existingResult.rows.length) {
      throw new InvariantError("Checkup sudah ada untuk user ini di event ini");
    }

    const id = `checkup-${nanoid(16)}`;
    const query = {
      text: `INSERT INTO participant_checkups 
             (id, event_id, user_id, checkup_date, blood_pressure_systolic, 
              blood_pressure_diastolic, heart_rate, weight, height, 
              medical_conditions, medications, fitness_level, is_approved, 
              approval_notes, checked_by, created_at, updated_at) 
             VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) 
             RETURNING id`,
      values: [
        id,
        eventId,
        userId,
        new Date(),
        bloodPressureSystolic,
        bloodPressureDiastolic,
        heartRate,
        weight,
        height,
        medicalConditions,
        medications,
        fitnessLevel,
        false, // is_approved
        null, // approval_notes
        checkedBy,
        new Date(), // created_at
        new Date(), // updated_at
      ],
    };

    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError("Checkup gagal ditambahkan");
    }
    return result.rows[0].id;
  }

  async getEventCheckups(eventId) {
    const query = {
      text: `SELECT 
               pc.id, pc.checkup_date, pc.blood_pressure_systolic, 
               pc.blood_pressure_diastolic, pc.heart_rate, pc.weight, 
               pc.height, pc.medical_conditions, pc.medications, 
               pc.fitness_level, pc.is_approved, pc.approval_notes, 
               pc.checked_by, pc.created_at,
               u.username, u.fullname,
               ep.participant_code, ep.role
             FROM participant_checkups pc
             JOIN users u ON u.id = pc.user_id
             LEFT JOIN event_participants ep ON ep.event_id = pc.event_id AND ep.user_id = pc.user_id
             WHERE pc.event_id = $1
             ORDER BY pc.checkup_date DESC`,
      values: [eventId],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async getCheckupByUserAndEvent(eventId, userId) {
    const query = {
      text: `SELECT 
               pc.id, pc.checkup_date, pc.blood_pressure_systolic, 
               pc.blood_pressure_diastolic, pc.heart_rate, pc.weight, 
               pc.height, pc.medical_conditions, pc.medications, 
               pc.fitness_level, pc.is_approved, pc.approval_notes, 
               pc.checked_by, pc.created_at, pc.updated_at,
               u.username, u.fullname,
               e.name as event_name, e.date as event_date,
               ep.participant_code, ep.role
             FROM participant_checkups pc
             JOIN users u ON u.id = pc.user_id
             JOIN events e ON e.id = pc.event_id
             LEFT JOIN event_participants ep ON ep.event_id = pc.event_id AND ep.user_id = pc.user_id
             WHERE pc.event_id = $1 AND pc.user_id = $2`,
      values: [eventId, userId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Checkup tidak ditemukan");
    }
    return result.rows[0];
  }

  async updateCheckup(
    eventId,
    userId,
    {
      bloodPressureSystolic,
      bloodPressureDiastolic,
      heartRate,
      weight,
      height,
      medicalConditions,
      medications,
      fitnessLevel,
      checkedBy,
    }
  ) {
    const query = {
      text: `UPDATE participant_checkups 
             SET blood_pressure_systolic = $1, blood_pressure_diastolic = $2, 
                 heart_rate = $3, weight = $4, height = $5, 
                 medical_conditions = $6, medications = $7, fitness_level = $8, 
                 checked_by = $9, updated_at = $10
             WHERE event_id = $11 AND user_id = $12 
             RETURNING id`,
      values: [
        bloodPressureSystolic,
        bloodPressureDiastolic,
        heartRate,
        weight,
        height,
        medicalConditions,
        medications,
        fitnessLevel,
        checkedBy,
        new Date(),
        eventId,
        userId,
      ],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Checkup tidak ditemukan");
    }
  }

  async deleteCheckup(eventId, userId) {
    const query = {
      text: "DELETE FROM participant_checkups WHERE event_id = $1 AND user_id = $2 RETURNING id",
      values: [eventId, userId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Checkup tidak ditemukan");
    }
  }

  async getUserCheckups(userId) {
    const query = {
      text: `SELECT 
               pc.id, pc.checkup_date, pc.blood_pressure_systolic, 
               pc.blood_pressure_diastolic, pc.heart_rate, pc.weight, 
               pc.height, pc.medical_conditions, pc.medications, 
               pc.fitness_level, pc.is_approved, pc.approval_notes, 
               pc.checked_by, pc.created_at,
               e.name as event_name, e.date as event_date,
               ep.participant_code, ep.role
             FROM participant_checkups pc
             JOIN events e ON e.id = pc.event_id
             LEFT JOIN event_participants ep ON ep.event_id = pc.event_id AND ep.user_id = pc.user_id
             WHERE pc.user_id = $1
             ORDER BY pc.checkup_date DESC`,
      values: [userId],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async updateApprovalStatus(checkupId, isApproved, approvalNotes) {
    const query = {
      text: `UPDATE participant_checkups 
             SET is_approved = $1, approval_notes = $2, updated_at = $3
             WHERE id = $4 
             RETURNING id`,
      values: [isApproved, approvalNotes, new Date(), checkupId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Checkup tidak ditemukan");
    }
  }
}

module.exports = ParticipantCheckupsService;
