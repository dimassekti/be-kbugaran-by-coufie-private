exports.up = (pgm) => {
  pgm.createTable("event_medical_staff", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    event_id: {
      type: "VARCHAR(50)",
      notNull: true,
      references: "events(id)",
      onDelete: "CASCADE",
    },
    hospital_staff_id: {
      type: "VARCHAR(50)",
      notNull: true,
      references: "hospital_medical_staff(id)",
      onDelete: "CASCADE",
    },
    assignment_role: {
      type: "VARCHAR(50)",
      default: "medical_support",
    },
    notes: {
      type: "TEXT",
    },
    assigned_date: {
      type: "TIMESTAMP",
      default: pgm.func("NOW()"),
    },
    created_at: {
      type: "TIMESTAMP",
      default: pgm.func("NOW()"),
    },
    updated_at: {
      type: "TIMESTAMP",
      default: pgm.func("NOW()"),
    },
    deleted_at: {
      type: "TIMESTAMP",
      default: null,
    },
  });

  // Create indexes for query performance
  pgm.createIndex("event_medical_staff", "event_id");
  pgm.createIndex("event_medical_staff", "hospital_staff_id");
  pgm.createIndex("event_medical_staff", "deleted_at");

  // Unique constraint to prevent duplicate assignments
  pgm.addConstraint("event_medical_staff", "event_medical_staff_unique", {
    unique: ["event_id", "hospital_staff_id"],
    where: "deleted_at IS NULL",
  });
};

exports.down = (pgm) => {
  pgm.dropTable("event_medical_staff");
};
