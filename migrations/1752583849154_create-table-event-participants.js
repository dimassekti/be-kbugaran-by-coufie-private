/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("event_participants", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    event_id: {
      type: "VARCHAR(50)",
      notNull: true,
      references: "events",
      onDelete: "cascade",
    },
    user_id: {
      type: "VARCHAR(50)",
      notNull: true,
      references: "users",
      onDelete: "cascade",
    },
    participant_code: {
      type: "VARCHAR(20)",
      notNull: true,
      unique: true,
      comment:
        "Unique alphanumeric code for each participant (e.g., P001, O001, I001)",
    },
    role: {
      type: "VARCHAR(20)",
      notNull: true,
      check:
        "role IN ('participant', 'organizer', 'instructor', 'medical_staff', 'volunteer')",
    },
    registration_date: {
      type: "TIMESTAMP",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
    status: {
      type: "VARCHAR(20)",
      notNull: true,
      default: "registered",
      check:
        "status IN ('registered', 'confirmed', 'checked_in', 'completed', 'cancelled', 'no_show')",
    },
    notes: {
      type: "TEXT",
    },
    created_at: {
      type: "TIMESTAMP",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
    updated_at: {
      type: "TIMESTAMP",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });

  // Add unique constraint to ensure one registration per user per event
  pgm.addConstraint("event_participants", "unique_user_event_participation", {
    unique: ["event_id", "user_id"],
  });

  // Add indexes for better query performance
  pgm.createIndex("event_participants", "event_id");
  pgm.createIndex("event_participants", "user_id");
  pgm.createIndex("event_participants", "participant_code");
  pgm.createIndex("event_participants", "role");
  pgm.createIndex("event_participants", "status");
  pgm.createIndex("event_participants", "registration_date");
};

exports.down = (pgm) => {
  pgm.dropTable("event_participants");
};
