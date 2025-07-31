const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const {
  notDeletedCondition,
  applySoftDelete,
} = require("../../utils/softDelete");

class EventMedicalStaffService {
  constructor() {
    this._pool = new Pool();
  }

  async assignStaffToEvent({
    eventId,
    hospitalStaffId,
    assignmentRole = "medical_support",
    notes,
  }) {
    // Check if staff is already assigned to this event
    const checkQuery = {
      text: `SELECT id FROM event_medical_staff 
             WHERE event_id = $1 AND hospital_staff_id = $2 AND ${notDeletedCondition()}`,
      values: [eventId, hospitalStaffId],
    };

    const checkResult = await this._pool.query(checkQuery);
    if (checkResult.rows.length > 0) {
      throw new InvariantError("Staff sudah ditugaskan ke event ini");
    }

    const id = `event-staff-${nanoid(16)}`;

    const query = {
      text: `INSERT INTO event_medical_staff 
             VALUES($1, $2, $3, $4, $5, NOW(), NOW(), NOW(), NULL) 
             RETURNING id`,
      values: [id, eventId, hospitalStaffId, assignmentRole, notes],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("Staff gagal ditugaskan ke event");
    }

    return result.rows[0].id;
  }

  async getEventMedicalStaff(eventId) {
    const query = {
      text: `SELECT ems.id, ems.event_id, ems.hospital_staff_id, ems.assignment_role, 
                    ems.notes, ems.assigned_date, ems.created_at, ems.updated_at,
                    hms.staff_role, hms.specialization, hms.license_number, hms.years_of_experience,
                    u.id as user_id, u.username, u.fullname,
                    h.id as hospital_id, h.name as hospital_name, h.type as hospital_type
             FROM event_medical_staff ems
             JOIN hospital_medical_staff hms ON ems.hospital_staff_id = hms.id
             JOIN users u ON hms.user_id = u.id
             JOIN hospitals h ON hms.hospital_id = h.id
             WHERE ems.event_id = $1 AND ems.${notDeletedCondition()} 
                   AND hms.${notDeletedCondition()} AND u.${notDeletedCondition()} AND h.${notDeletedCondition()}
             ORDER BY ems.assigned_date DESC`,
      values: [eventId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async getAvailableStaffForEvent(eventId) {
    const query = {
      text: `SELECT hms.id, hms.hospital_id, hms.user_id, hms.staff_role, 
                    hms.specialization, hms.license_number, hms.years_of_experience,
                    u.username, u.fullname,
                    h.name as hospital_name, h.type as hospital_type
             FROM hospital_medical_staff hms
             JOIN users u ON hms.user_id = u.id
             JOIN hospitals h ON hms.hospital_id = h.id
             WHERE hms.is_active = true 
                   AND hms.${notDeletedCondition()} AND u.${notDeletedCondition()} AND h.${notDeletedCondition()}
                   AND hms.id NOT IN (
                     SELECT hospital_staff_id 
                     FROM event_medical_staff 
                     WHERE event_id = $1 AND ${notDeletedCondition()}
                   )
             ORDER BY h.name, hms.staff_role, u.fullname`,
      values: [eventId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async removeStaffFromEvent(eventStaffId) {
    await applySoftDelete(this._pool, "event_medical_staff", eventStaffId);
  }

  async getEventStaffById(eventStaffId) {
    const query = {
      text: `SELECT ems.id, ems.event_id, ems.hospital_staff_id, ems.assignment_role, 
                    ems.notes, ems.assigned_date, ems.created_at, ems.updated_at,
                    hms.staff_role, hms.specialization,
                    u.id as user_id, u.username, u.fullname,
                    h.id as hospital_id, h.name as hospital_name
             FROM event_medical_staff ems
             JOIN hospital_medical_staff hms ON ems.hospital_staff_id = hms.id
             JOIN users u ON hms.user_id = u.id
             JOIN hospitals h ON hms.hospital_id = h.id
             WHERE ems.id = $1 AND ems.${notDeletedCondition()} 
                   AND hms.${notDeletedCondition()} AND u.${notDeletedCondition()} AND h.${notDeletedCondition()}`,
      values: [eventStaffId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Event medical staff tidak ditemukan");
    }

    return result.rows[0];
  }
}

module.exports = EventMedicalStaffService;
