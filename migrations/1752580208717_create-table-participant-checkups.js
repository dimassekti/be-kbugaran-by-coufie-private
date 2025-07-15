/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('participant_checkups', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    event_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'events',
      onDelete: 'cascade',
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'users',
      onDelete: 'cascade',
    },
    checkup_date: {
      type: 'TIMESTAMP',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    blood_pressure_systolic: {
      type: 'INTEGER',
    },
    blood_pressure_diastolic: {
      type: 'INTEGER',
    },
    heart_rate: {
      type: 'INTEGER',
    },
    weight: {
      type: 'DECIMAL(5,2)',
    },
    height: {
      type: 'DECIMAL(5,2)',
    },
    medical_conditions: {
      type: 'TEXT',
    },
    medications: {
      type: 'TEXT',
    },
    fitness_level: {
      type: 'VARCHAR(20)',
      check: "fitness_level IN ('beginner', 'intermediate', 'advanced')",
    },
    is_approved: {
      type: 'BOOLEAN',
      notNull: true,
      default: false,
    },
    approval_notes: {
      type: 'TEXT',
    },
    checked_by: {
      type: 'VARCHAR(100)',
    },
    created_at: {
      type: 'TIMESTAMP',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'TIMESTAMP',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  // Add unique constraint to ensure one checkup per user per event
  pgm.addConstraint('participant_checkups', 'unique_user_event_checkup', {
    unique: ['event_id', 'user_id'],
  });

  // Add indexes for better query performance
  pgm.createIndex('participant_checkups', 'event_id');
  pgm.createIndex('participant_checkups', 'user_id');
  pgm.createIndex('participant_checkups', 'is_approved');
};

exports.down = (pgm) => {
  pgm.dropTable('participant_checkups');
};
