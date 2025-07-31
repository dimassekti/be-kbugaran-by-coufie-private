const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const DatabaseError = require("../../exceptions/DatabaseError");
const {
  notDeletedCondition,
  applySoftDelete,
} = require("../../utils/softDelete");

class HospitalsService {
  constructor() {
    this._pool = new Pool();
  }

  async addHospital({
    name,
    type,
    address,
    phone,
    email,
    description,
    isActive = true,
  }) {
    const id = `hospital-${nanoid(16)}`;

    const query = {
      text: "INSERT INTO hospitals VALUES($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW(), NULL) RETURNING id",
      values: [id, name, type, address, phone, email, description, isActive],
    };

    try {
      const result = await this._pool.query(query);

      if (!result.rows[0].id) {
        throw new InvariantError("Hospital gagal ditambahkan");
      }

      return result.rows[0].id;
    } catch (error) {
      // Handle database constraint violations
      if (error.code) {
        throw DatabaseError.fromPostgreSQLError(error);
      }
      throw error;
    }
  }

  async getHospitals() {
    const query = {
      text: `SELECT id, name, type, address, phone, email, description, is_active, created_at, updated_at 
             FROM hospitals 
             WHERE ${notDeletedCondition()} 
             ORDER BY name ASC`,
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async getHospitalById(id) {
    const query = {
      text: `SELECT id, name, type, address, phone, email, description, is_active, created_at, updated_at 
             FROM hospitals 
             WHERE id = $1 AND ${notDeletedCondition()}`,
      values: [id],
    };

    try {
      const result = await this._pool.query(query);

      if (!result.rows.length) {
        throw new NotFoundError("Hospital tidak ditemukan");
      }

      return result.rows[0];
    } catch (error) {
      if (error.code) {
        throw DatabaseError.fromPostgreSQLError(error);
      }
      throw error;
    }
  }

  async editHospitalById(
    id,
    { name, type, address, phone, email, description, isActive }
  ) {
    const query = {
      text: `UPDATE hospitals 
             SET name = $1, type = $2, address = $3, phone = $4, email = $5, description = $6, is_active = $7, updated_at = NOW()
             WHERE id = $8 AND ${notDeletedCondition()}
             RETURNING id`,
      values: [name, type, address, phone, email, description, isActive, id],
    };

    try {
      const result = await this._pool.query(query);

      if (!result.rows.length) {
        throw new NotFoundError(
          "Gagal memperbarui hospital. Id tidak ditemukan"
        );
      }
    } catch (error) {
      if (error.code) {
        throw DatabaseError.fromPostgreSQLError(error);
      }
      throw error;
    }
  }

  async deleteHospitalById(id) {
    await applySoftDelete(this._pool, "hospitals", id);
  }
}

module.exports = HospitalsService;
