/* eslint-disable quotes */
/* eslint-disable lines-between-class-members */
const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const AuthenticationError = require("../../exceptions/AuthenticationError");
const {
  notDeletedCondition,
  softDeleteQuery,
  buildSelectQuery,
} = require("../../utils/softDelete");

class UsersService {
  constructor() {
    this._pool = new Pool();
  }

  async addUser({ username, password, fullname, role = "member" }) {
    // TODO: Verifikasi username, pastikan belum terdaftar.
    await this.verifyNewUsername(username);

    // TODO: Bila verifikasi lolos, maka masukkan user baru ke database.
    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = {
      text: "INSERT INTO users (id, username, password, fullname, role) VALUES($1, $2, $3, $4, $5) RETURNING id",
      values: [id, username, hashedPassword, fullname, role],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError("User gagal ditambahkan");
    }
    return result.rows[0].id;
  }

  async verifyNewUsername(username) {
    const query = {
      text: `SELECT username FROM users WHERE username = $1 AND ${notDeletedCondition()}`,
      values: [username],
    };

    const result = await this._pool.query(query);

    if (result.rows.length > 0) {
      throw new InvariantError(
        "Gagal menambahkan user. Username sudah digunakan."
      );
    }
  }

  async getUserById(userId) {
    const query = {
      text: `SELECT id, username, fullname FROM users WHERE id = $1 AND ${notDeletedCondition()}`,
      values: [userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("User tidak ditemukan");
    }
    return result.rows[0];
  }

  async getUserByIdWithRole(userId) {
    const query = {
      text: `SELECT id, username, fullname, role FROM users WHERE id = $1 AND ${notDeletedCondition()}`,
      values: [userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("User tidak ditemukan");
    }
    return result.rows[0];
  }

  async getAllUsers() {
    const query = {
      text: buildSelectQuery("users", "id, username, fullname, role"),
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async deleteUserById(userId) {
    const query = {
      text: softDeleteQuery("users"),
      values: [userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("User tidak ditemukan");
    }
  }

  async updateUserRole(userId, newRole) {
    const query = {
      text: `UPDATE users SET role = $2 WHERE id = $1 AND ${notDeletedCondition()} RETURNING id`,
      values: [userId, newRole],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("User tidak ditemukan");
    }
  }

  async verifyUserCredential(username, password) {
    const query = {
      text: `SELECT id, password FROM users WHERE username = $1 AND ${notDeletedCondition()}`,
      values: [username],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new AuthenticationError("Kredensial yang Anda berikan salah");
    }

    const { id, password: hashedPassword } = result.rows[0];
    const match = await bcrypt.compare(password, hashedPassword);

    if (!match) {
      throw new AuthenticationError("Kredensial yang Anda berikan salah");
    }
    return id;
  }
}

module.exports = UsersService;
