exports.up = (pgm) => {
  pgm.createTable("hospitals", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    name: {
      type: "TEXT",
      notNull: true,
    },
    type: {
      type: "VARCHAR(20)",
      notNull: true,
      check: "type IN ('hospital', 'clinic')",
    },
    address: {
      type: "TEXT",
    },
    phone: {
      type: "VARCHAR(20)",
    },
    email: {
      type: "VARCHAR(100)",
    },
    description: {
      type: "TEXT",
    },
    is_active: {
      type: "BOOLEAN",
      default: true,
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
  pgm.createIndex("hospitals", "name");
  pgm.createIndex("hospitals", "type");
  pgm.createIndex("hospitals", "is_active");
  pgm.createIndex("hospitals", "deleted_at");

  // Unique constraint on name where not soft-deleted
  pgm.addConstraint("hospitals", "hospitals_name_unique", {
    unique: ["name"],
    where: "deleted_at IS NULL",
  });
};

exports.down = (pgm) => {
  pgm.dropTable("hospitals");
};
