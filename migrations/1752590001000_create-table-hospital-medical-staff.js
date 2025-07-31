exports.up = (pgm) => {
  pgm.createTable("hospital_medical_staff", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    hospital_id: {
      type: "VARCHAR(50)",
      notNull: true,
      references: "hospitals(id)",
      onDelete: "CASCADE",
    },
    user_id: {
      type: "VARCHAR(50)",
      notNull: true,
      references: "users(id)",
      onDelete: "CASCADE",
    },
    staff_role: {
      type: "VARCHAR(20)",
      notNull: true,
      check: "staff_role IN ('doctor', 'nurse')",
    },
    specialization: {
      type: "VARCHAR(100)",
    },
    license_number: {
      type: "VARCHAR(50)",
    },
    years_of_experience: {
      type: "INTEGER",
    },
    is_active: {
      type: "BOOLEAN",
      default: true,
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
  pgm.createIndex("hospital_medical_staff", "hospital_id");
  pgm.createIndex("hospital_medical_staff", "user_id");
  pgm.createIndex("hospital_medical_staff", "staff_role");
  pgm.createIndex("hospital_medical_staff", "deleted_at");

  // Unique constraint to prevent duplicate assignments
  pgm.addConstraint("hospital_medical_staff", "hospital_medical_staff_unique", {
    unique: ["hospital_id", "user_id"],
    where: "deleted_at IS NULL",
  });
};

exports.down = (pgm) => {
  pgm.dropTable("hospital_medical_staff");
};
