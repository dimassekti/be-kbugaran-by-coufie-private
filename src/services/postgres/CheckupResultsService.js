const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");

class CheckupResultsService {
  constructor() {
    this._pool = new Pool();
  }

  async addCheckupResult({
    participantCheckupId,
    resultStatus,
    organizerNotes,
    healthConcerns,
    restrictions,
    recommendations,
    reviewedBy,
  }) {
    // Check if result already exists for this checkup
    const existingQuery = {
      text: "SELECT id FROM checkup_results WHERE participant_checkup_id = $1",
      values: [participantCheckupId],
    };

    const existingResult = await this._pool.query(existingQuery);
    if (existingResult.rows.length) {
      throw new InvariantError("Result sudah ada untuk checkup ini");
    }

    const id = `result-${nanoid(16)}`;
    const query = {
      text: `INSERT INTO checkup_results 
             (id, participant_checkup_id, result_status, organizer_notes, 
              health_concerns, restrictions, recommendations, reviewed_by, 
              reviewed_at, created_at, updated_at) 
             VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
             RETURNING id`,
      values: [
        id,
        participantCheckupId,
        resultStatus,
        organizerNotes,
        healthConcerns,
        restrictions,
        recommendations,
        reviewedBy,
        new Date(), // reviewed_at
        new Date(), // created_at
        new Date(), // updated_at
      ],
    };

    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError("Checkup result gagal ditambahkan");
    }
    return result.rows[0].id;
  }

  async getCheckupResult(checkupId) {
    const query = {
      text: `SELECT 
               cr.id, cr.result_status, cr.organizer_notes, cr.health_concerns,
               cr.restrictions, cr.recommendations, cr.reviewed_at,
               reviewer.username as reviewer_username, reviewer.fullname as reviewer_fullname,
               pc.checkup_date, pc.blood_pressure_systolic, pc.blood_pressure_diastolic,
               pc.heart_rate, pc.weight, pc.height, pc.medical_conditions,
               pc.medications, pc.fitness_level, pc.checked_by,
               u.username, u.fullname,
               e.name as event_name, e.date as event_date
             FROM checkup_results cr
             JOIN participant_checkups pc ON pc.id = cr.participant_checkup_id
             JOIN users u ON u.id = pc.user_id
             JOIN users reviewer ON reviewer.id = cr.reviewed_by
             JOIN events e ON e.id = pc.event_id
             WHERE cr.participant_checkup_id = $1`,
      values: [checkupId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Checkup result tidak ditemukan");
    }
    return result.rows[0];
  }

  async updateCheckupResult(
    resultId,
    {
      resultStatus,
      organizerNotes,
      healthConcerns,
      restrictions,
      recommendations,
      reviewedBy,
    }
  ) {
    const query = {
      text: `UPDATE checkup_results 
             SET result_status = $1, organizer_notes = $2, health_concerns = $3,
                 restrictions = $4, recommendations = $5, reviewed_by = $6,
                 reviewed_at = $7, updated_at = $8
             WHERE id = $9
             RETURNING id`,
      values: [
        resultStatus,
        organizerNotes,
        healthConcerns,
        restrictions,
        recommendations,
        reviewedBy,
        new Date(), // reviewed_at
        new Date(), // updated_at
        resultId,
      ],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Checkup result tidak ditemukan");
    }
  }

  async getEventCheckupResults(eventId) {
    const query = {
      text: `SELECT 
               cr.id, cr.result_status, cr.organizer_notes, cr.health_concerns,
               cr.restrictions, cr.recommendations, cr.reviewed_at,
               reviewer.username as reviewer_username, reviewer.fullname as reviewer_fullname,
               pc.id as checkup_id, pc.checkup_date,
               u.username, u.fullname,
               ep.participant_code, ep.role
             FROM checkup_results cr
             JOIN participant_checkups pc ON pc.id = cr.participant_checkup_id
             JOIN users u ON u.id = pc.user_id
             JOIN users reviewer ON reviewer.id = cr.reviewed_by
             LEFT JOIN event_participants ep ON ep.event_id = pc.event_id AND ep.user_id = pc.user_id
             WHERE pc.event_id = $1
             ORDER BY cr.reviewed_at DESC`,
      values: [eventId],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async getResultsByStatus(eventId, status) {
    const query = {
      text: `SELECT 
               cr.id, cr.result_status, cr.organizer_notes, cr.reviewed_at,
               pc.id as checkup_id, pc.checkup_date,
               u.username, u.fullname,
               ep.participant_code, ep.role
             FROM checkup_results cr
             JOIN participant_checkups pc ON pc.id = cr.participant_checkup_id
             JOIN users u ON u.id = pc.user_id
             LEFT JOIN event_participants ep ON ep.event_id = pc.event_id AND ep.user_id = pc.user_id
             WHERE pc.event_id = $1 AND cr.result_status = $2
             ORDER BY cr.reviewed_at DESC`,
      values: [eventId, status],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = CheckupResultsService;
