const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");

class EventsService {
  constructor() {
    this._pool = new Pool();
  }

  async addEvent({ name, date, description }) {
    const id = `event-${nanoid(16)}`;
    const query = {
      text: "INSERT INTO events VALUES($1, $2, $3, $4) RETURNING id",
      values: [id, name, date, description || null],
    };

    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError("Event gagal ditambahkan");
    }
    return result.rows[0].id;
  }

  async getEvents() {
    const query = {
      text: "SELECT id, name, date, description FROM events ORDER BY date ASC",
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async getEventById(id) {
    const query = {
      text: "SELECT id, name, date, description FROM events WHERE id = $1",
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Event tidak ditemukan");
    }
    return result.rows[0];
  }

  async editEventById(id, { name, date, description }) {
    const query = {
      text: "UPDATE events SET name = $1, date = $2, description = $3 WHERE id = $4 RETURNING id",
      values: [name, date, description, id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Gagal memperbarui event. Id tidak ditemukan");
    }
  }

  async deleteEventById(id) {
    const query = {
      text: "DELETE FROM events WHERE id = $1 RETURNING id",
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Event tidak ditemukan");
    }
  }
}

module.exports = EventsService;
