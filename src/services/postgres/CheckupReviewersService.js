const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class CheckupReviewersService {
  constructor() {
    this._pool = new Pool();
  }

  async addReviewer({ userId, name, degree, specialization, contactPhone, contactEmail }) {
    // Check if reviewer already exists for this user
    const existingQuery = {
      text: 'SELECT id FROM checkup_reviewers WHERE user_id = $1',
      values: [userId],
    };

    const existingResult = await this._pool.query(existingQuery);
    if (existingResult.rows.length) {
      throw new InvariantError('Reviewer profile sudah ada untuk user ini');
    }

    const id = `reviewer-${nanoid(16)}`;
    const query = {
      text: `INSERT INTO checkup_reviewers 
             (id, user_id, name, degree, specialization, contact_phone, 
              contact_email, is_active, created_at, updated_at) 
             VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
             RETURNING id`,
      values: [
        id,
        userId,
        name,
        degree,
        specialization,
        contactPhone,
        contactEmail,
        true, // is_active
        new Date(), // created_at
        new Date(), // updated_at
      ],
    };

    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Reviewer gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async getReviewers() {
    const query = {
      text: `SELECT 
               cr.id, cr.name, cr.degree, cr.specialization, 
               cr.contact_phone, cr.contact_email, cr.is_active, 
               cr.created_at,
               u.username, u.fullname, u.role
             FROM checkup_reviewers cr
             JOIN users u ON u.id = cr.user_id
             ORDER BY cr.name ASC`,
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async getActiveReviewers() {
    const query = {
      text: `SELECT 
               cr.id, cr.name, cr.degree, cr.specialization, 
               cr.contact_phone, cr.contact_email,
               u.username, u.fullname
             FROM checkup_reviewers cr
             JOIN users u ON u.id = cr.user_id
             WHERE cr.is_active = true
             ORDER BY cr.name ASC`,
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async getReviewerById(id) {
    const query = {
      text: `SELECT 
               cr.id, cr.name, cr.degree, cr.specialization, 
               cr.contact_phone, cr.contact_email, cr.is_active, 
               cr.created_at, cr.updated_at,
               u.username, u.fullname, u.role
             FROM checkup_reviewers cr
             JOIN users u ON u.id = cr.user_id
             WHERE cr.id = $1`,
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Reviewer tidak ditemukan');
    }
    return result.rows[0];
  }

  async updateReviewer(id, { name, degree, specialization, contactPhone, contactEmail }) {
    const query = {
      text: `UPDATE checkup_reviewers 
             SET name = $1, degree = $2, specialization = $3, 
                 contact_phone = $4, contact_email = $5, updated_at = $6
             WHERE id = $7 
             RETURNING id`,
      values: [name, degree, specialization, contactPhone, contactEmail, new Date(), id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Reviewer tidak ditemukan');
    }
  }

  async toggleReviewerStatus(id, isActive) {
    const query = {
      text: 'UPDATE checkup_reviewers SET is_active = $1, updated_at = $2 WHERE id = $3 RETURNING id',
      values: [isActive, new Date(), id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Reviewer tidak ditemukan');
    }
  }

  async deleteReviewer(id) {
    const query = {
      text: 'DELETE FROM checkup_reviewers WHERE id = $1 RETURNING id',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Reviewer tidak ditemukan');
    }
  }

  async getReviewerByUserId(userId) {
    const query = {
      text: `SELECT 
               cr.id, cr.name, cr.degree, cr.specialization, 
               cr.contact_phone, cr.contact_email, cr.is_active, 
               cr.created_at, cr.updated_at
             FROM checkup_reviewers cr
             WHERE cr.user_id = $1`,
      values: [userId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Reviewer profile tidak ditemukan untuk user ini');
    }
    return result.rows[0];
  }
}

module.exports = CheckupReviewersService;
