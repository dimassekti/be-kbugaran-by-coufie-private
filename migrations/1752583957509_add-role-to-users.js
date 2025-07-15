/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  // Add role column to users table
  pgm.addColumn("users", {
    role: {
      type: "VARCHAR(20)",
      notNull: true,
      default: "member",
      check: "role IN ('admin', 'staff', 'member')",
    },
  });

  // Add index for better query performance on role
  pgm.createIndex("users", "role");
};

exports.down = (pgm) => {
  // Remove the role column
  pgm.dropColumn("users", "role");
};
