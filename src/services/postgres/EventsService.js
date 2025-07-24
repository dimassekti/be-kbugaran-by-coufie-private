const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const {
  notDeletedCondition,
  softDeleteQuery,
  buildSelectQuery,
} = require("../../utils/softDelete");

class EventsService {
  constructor() {
    this._pool = new Pool();
  }

  async addEvent({
    name,
    date,
    description,
    location,
    organizer,
    capacity,
    category,
  }) {
    const id = `event-${nanoid(16)}`;
    const query = {
      text: "INSERT INTO events (id, name, date, description, location, organizer, capacity, category) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id",
      values: [
        id,
        name,
        date,
        description || null,
        location || null,
        organizer || null,
        capacity || null,
        category || null,
      ],
    };

    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError("Event gagal ditambahkan");
    }
    return result.rows[0].id;
  }

  async getEvents() {
    const query = {
      text: `${buildSelectQuery(
        "events",
        "id, name, date, description, location, organizer, capacity, category"
      )} ORDER BY date ASC`,
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async getEventById(id) {
    const query = {
      text: `SELECT id, name, date, description, location, organizer, capacity, category FROM events WHERE id = $1 AND ${notDeletedCondition()}`,
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Event tidak ditemukan");
    }
    return result.rows[0];
  }

  async editEventById(
    id,
    { name, date, description, location, organizer, capacity, category }
  ) {
    const query = {
      text: `UPDATE events SET name = $1, date = $2, description = $3, location = $4, organizer = $5, capacity = $6, category = $7 WHERE id = $8 AND ${notDeletedCondition()} RETURNING id`,
      values: [
        name,
        date,
        description,
        location || null,
        organizer || null,
        capacity || null,
        category || null,
        id,
      ],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Gagal memperbarui event. Id tidak ditemukan");
    }
  }

  async deleteEventById(id) {
    const query = {
      text: softDeleteQuery("events"),
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError("Event tidak ditemukan");
    }
  }
}

module.exports = EventsService;
