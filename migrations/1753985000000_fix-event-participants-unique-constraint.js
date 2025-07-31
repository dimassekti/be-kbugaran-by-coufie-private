/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  // Drop the old unique constraint that doesn't consider soft deletes
  pgm.dropConstraint("event_participants", "unique_user_event_participation");

  // Create a partial unique index that only applies to non-deleted records
  pgm.sql(
    "CREATE UNIQUE INDEX event_participants_user_event_unique ON event_participants(event_id, user_id) WHERE deleted_at IS NULL"
  );
};

exports.down = (pgm) => {
  // Drop the partial unique index
  pgm.sql("DROP INDEX IF EXISTS event_participants_user_event_unique");

  // Recreate the original constraint (note: this might fail if there are soft-deleted duplicates)
  pgm.addConstraint("event_participants", "unique_user_event_participation", {
    unique: ["event_id", "user_id"],
  });
};
