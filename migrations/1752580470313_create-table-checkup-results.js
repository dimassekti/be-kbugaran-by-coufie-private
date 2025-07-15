/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("checkup_results", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    participant_checkup_id: {
      type: "VARCHAR(50)",
      notNull: true,
      references: "participant_checkups",
      onDelete: "cascade",
    },
    result_status: {
      type: "VARCHAR(20)",
      notNull: true,
      check: "result_status IN ('allowed', 'allowed_with_note', 'declined')",
    },
    organizer_notes: {
      type: "TEXT",
    },
    health_concerns: {
      type: "TEXT",
    },
    restrictions: {
      type: "TEXT",
    },
    recommendations: {
      type: "TEXT",
    },
    reviewed_by: {
      type: "VARCHAR(50)",
      notNull: true,
      references: "users",
      onDelete: "restrict",
    },
    reviewed_at: {
      type: "TIMESTAMP",
      notNull: true,
      default: pgm.func("current_timestamp"),
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

  // Add unique constraint to ensure one result per checkup
  pgm.addConstraint("checkup_results", "unique_checkup_result", {
    unique: ["participant_checkup_id"],
  });

  // Add indexes for better query performance
  pgm.createIndex("checkup_results", "participant_checkup_id");
  pgm.createIndex("checkup_results", "result_status");
  pgm.createIndex("checkup_results", "reviewed_by");
  pgm.createIndex("checkup_results", "reviewed_at");
};

exports.down = (pgm) => {
  pgm.dropTable("checkup_results");
};
