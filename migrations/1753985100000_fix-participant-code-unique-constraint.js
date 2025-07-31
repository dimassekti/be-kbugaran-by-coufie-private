/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  // Drop the global unique constraint on participant_code
  pgm.dropConstraint(
    "event_participants",
    "event_participants_participant_code_key"
  );

  // Create a partial unique index that ensures participant_code is unique per event
  // and only applies to non-deleted records
  pgm.sql(
    "CREATE UNIQUE INDEX event_participants_code_event_unique ON event_participants(event_id, participant_code) WHERE deleted_at IS NULL"
  );
};

exports.down = (pgm) => {
  // Drop the partial unique index
  pgm.sql("DROP INDEX IF EXISTS event_participants_code_event_unique");

  // Recreate the original global unique constraint
  // Note: this might fail if there are duplicate participant codes across events
  pgm.addConstraint(
    "event_participants",
    "event_participants_participant_code_key",
    {
      unique: ["participant_code"],
    }
  );
};
