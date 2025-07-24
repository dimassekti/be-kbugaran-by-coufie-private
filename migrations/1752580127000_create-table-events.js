/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("events", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    name: {
      type: "TEXT",
      notNull: true,
    },
    date: {
      type: "TIMESTAMP",
      notNull: true,
    },
    description: {
      type: "TEXT",
    },
    location: {
      type: "VARCHAR(255)",
    },
    organizer: {
      type: "VARCHAR(255)",
    },
    capacity: {
      type: "INTEGER",
    },
    category: {
      type: "VARCHAR(100)",
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("events");
};
