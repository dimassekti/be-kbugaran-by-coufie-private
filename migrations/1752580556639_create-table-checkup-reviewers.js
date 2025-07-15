/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("checkup_reviewers", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    user_id: {
      type: "VARCHAR(50)",
      notNull: true,
      references: "users",
      onDelete: "cascade",
    },
    name: {
      type: "VARCHAR(200)",
      notNull: true,
    },
    degree: {
      type: "VARCHAR(100)",
    },
    specialization: {
      type: "VARCHAR(100)",
    },
    contact_phone: {
      type: "VARCHAR(20)",
    },
    contact_email: {
      type: "VARCHAR(100)",
    },
    is_active: {
      type: "BOOLEAN",
      notNull: true,
      default: true,
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

  // Add unique constraint to ensure one reviewer profile per user
  pgm.addConstraint("checkup_reviewers", "unique_user_reviewer", {
    unique: ["user_id"],
  });

  // Add indexes for better query performance
  pgm.createIndex("checkup_reviewers", "user_id");
  pgm.createIndex("checkup_reviewers", "is_active");
  pgm.createIndex("checkup_reviewers", "specialization");
};

exports.down = (pgm) => {
  pgm.dropTable("checkup_reviewers");
};
