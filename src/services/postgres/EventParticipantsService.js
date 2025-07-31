const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const {
  notDeletedCondition,
  softDeleteQuery,
} = require("../../utils/softDelete");

class EventParticipantsService {
  constructor() {
    this._pool = new Pool();
  }

  async addParticipant({ eventId, userId, role = "participant" }) {
    // Check if user is already registered for this event
    const existingQuery = {
      text: `SELECT id FROM event_participants WHERE event_id = $1 AND user_id = $2 AND ${notDeletedCondition()}`,
      values: [eventId, userId],
    };

    const existingResult = await this._pool.query(existingQuery);
    if (existingResult.rows.length) {
      throw new InvariantError("User sudah terdaftar untuk event ini");
    }

    // Generate participant code with retry logic
    let participantCode;
    let attempts = 0;
    const maxAttempts = 5;

    while (attempts < maxAttempts) {
      try {
        participantCode = await this._generateParticipantCode(eventId, role);

        const id = `participant-${nanoid(16)}`;
        const query = {
          text: "INSERT INTO event_participants VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id",
          values: [
            id,
            eventId,
            userId,
            participantCode,
            role,
            new Date(), // registration_date
            "registered", // status
            null, // notes
            new Date(), // created_at
            new Date(), // updated_at
          ],
        };

        const result = await this._pool.query(query);
        if (!result.rows[0].id) {
          throw new InvariantError("Gagal mendaftarkan participant");
        }
        return { id: result.rows[0].id, participantCode };
      } catch (error) {
        if (error.constraint === "event_participants_code_event_unique") {
          attempts++;
          if (attempts >= maxAttempts) {
            throw new InvariantError(
              "Gagal menghasilkan kode participant yang unik. Silakan coba lagi."
            );
          }
          // Retry with a new participant code
          continue;
        }
        // Re-throw other errors
        throw error;
      }
    }
  }

  async joinEvent(eventId, userId) {
    return this.addParticipant({
      eventId,
      userId,
      role: "participant",
    });
  }

  async getEventParticipants(eventId) {
    const query = {
      text: `SELECT 
               ep.id, ep.participant_code, ep.role, ep.registration_date, ep.status, ep.notes,
               u.username, u.fullname
             FROM event_participants ep
             JOIN users u ON u.id = ep.user_id
             WHERE ep.event_id = $1 AND ep.${notDeletedCondition()} AND u.${notDeletedCondition()}
             ORDER BY ep.registration_date ASC`,
      values: [eventId],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async getParticipantByUserAndEvent(eventId, userId) {
    const query = {
      text: `SELECT 
               ep.id, ep.participant_code, ep.role, ep.registration_date, ep.status, ep.notes,
               u.username, u.fullname,
               e.name as event_name, e.date as event_date
             FROM event_participants ep
             JOIN users u ON u.id = ep.user_id
             JOIN events e ON e.id = ep.event_id
             WHERE ep.event_id = $1 AND ep.user_id = $2 AND ep.${notDeletedCondition()} AND u.${notDeletedCondition()} AND e.${notDeletedCondition()}`,
      values: [eventId, userId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Participant tidak ditemukan");
    }
    return result.rows[0];
  }

  async updateParticipantStatus(eventId, userId, status, notes = null) {
    const query = {
      text: `UPDATE event_participants SET status = $1, notes = $2, updated_at = $3 WHERE event_id = $4 AND user_id = $5 AND ${notDeletedCondition()} RETURNING id`,
      values: [status, notes, new Date(), eventId, userId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Participant tidak ditemukan");
    }
  }

  async removeParticipant(eventId, userId) {
    const query = {
      text: `UPDATE event_participants SET deleted_at = NOW() WHERE event_id = $1 AND user_id = $2 AND ${notDeletedCondition()}`,
      values: [eventId, userId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError("Participant tidak ditemukan");
    }
  }

  async _generateParticipantCode(eventId, role) {
    const prefixes = {
      participant: "P",
      organizer: "O",
      instructor: "I",
      medical_staff: "M",
      volunteer: "V",
    };

    const prefix = prefixes[role] || "P";

    // Get the highest existing participant code for this event and role
    const query = {
      text: `SELECT participant_code FROM event_participants 
             WHERE event_id = $1 AND participant_code LIKE $2 AND ${notDeletedCondition()}
             ORDER BY participant_code DESC LIMIT 1`,
      values: [eventId, `${prefix}%`],
    };

    const result = await this._pool.query(query);

    let nextNumber = 1;
    if (result.rows.length > 0) {
      const lastCode = result.rows[0].participant_code;
      // Extract number from code like "P001" -> 1
      const lastNumber = parseInt(lastCode.substring(1), 10);
      nextNumber = lastNumber + 1;
    }

    // Format with leading zeros (e.g., P001, P002, etc.)
    return `${prefix}${nextNumber.toString().padStart(3, "0")}`;
  }

  async getUserEvents(userId) {
    const query = {
      text: `SELECT 
               e.id, e.name, e.date, e.description,
               ep.participant_code, ep.role, ep.status, ep.registration_date
             FROM event_participants ep
             JOIN events e ON e.id = ep.event_id
             WHERE ep.user_id = $1 AND ep.${notDeletedCondition()} AND e.${notDeletedCondition()}
             ORDER BY e.date DESC`,
      values: [userId],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async getParticipantById(participantId) {
    const query = {
      text: `SELECT 
               ep.id, ep.participant_code, ep.role, ep.status, ep.registration_date, ep.notes,
               ep.event_id, ep.user_id,
               u.username, u.fullname, u.role as user_role,
               e.name as event_name, e.date as event_date, e.description as event_description
             FROM event_participants ep
             JOIN users u ON u.id = ep.user_id
             JOIN events e ON e.id = ep.event_id
             WHERE ep.id = $1 AND ep.${notDeletedCondition()} AND u.${notDeletedCondition()} AND e.${notDeletedCondition()}`,
      values: [participantId],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Participant tidak ditemukan");
    }

    return result.rows[0];
  }
}

module.exports = EventParticipantsService;
