exports.up = (pgm) => {
  // Add deleted_at column to all existing tables
  const tables = [
    "users",
    "albums",
    "songs",
    "playlists",
    "playlist_songs",
    "collaborations",
    "user_album_likes",
    "authentications",
    "events",
    "event_participants",
    "participant_checkups",
    "checkup_results",
    "checkup_reviewers",
  ];

  tables.forEach((table) => {
    pgm.addColumn(table, {
      deleted_at: {
        type: "TIMESTAMP",
        default: null,
      },
    });

    // Add index on deleted_at for performance
    pgm.createIndex(table, "deleted_at", {
      name: `idx_${table}_deleted_at`,
    });
  });

  // Create partial unique indexes where needed to maintain uniqueness for non-deleted records
  pgm.sql("ALTER TABLE users DROP CONSTRAINT IF EXISTS users_username_key");
  pgm.sql(
    "CREATE UNIQUE INDEX users_username_unique ON users(username) WHERE deleted_at IS NULL"
  );

  // Album title uniqueness per year
  pgm.sql("ALTER TABLE albums DROP CONSTRAINT IF EXISTS albums_name_year_key");
  pgm.sql(
    "CREATE UNIQUE INDEX albums_name_year_unique ON albums(name, year) WHERE deleted_at IS NULL"
  );

  // Song title uniqueness per album
  pgm.sql(
    "ALTER TABLE songs DROP CONSTRAINT IF EXISTS songs_title_album_id_key"
  );
  pgm.sql(
    "CREATE UNIQUE INDEX songs_title_album_id_unique ON songs(title, album_id) WHERE deleted_at IS NULL"
  );

  // Playlist name uniqueness per owner
  pgm.sql(
    "ALTER TABLE playlists DROP CONSTRAINT IF EXISTS playlists_name_owner_key"
  );
  pgm.sql(
    "CREATE UNIQUE INDEX playlists_name_owner_unique ON playlists(name, owner) WHERE deleted_at IS NULL"
  );
};

exports.down = (pgm) => {
  const tables = [
    "users",
    "albums",
    "songs",
    "playlists",
    "playlist_songs",
    "collaborations",
    "user_album_likes",
    "authentications",
    "events",
    "event_participants",
    "participant_checkups",
    "checkup_results",
    "checkup_reviewers",
  ];

  // Drop partial unique indexes and recreate original ones
  pgm.sql("DROP INDEX IF EXISTS users_username_unique");
  pgm.sql(
    "ALTER TABLE users ADD CONSTRAINT users_username_key UNIQUE (username)"
  );

  pgm.sql("DROP INDEX IF EXISTS albums_name_year_unique");
  pgm.sql(
    "ALTER TABLE albums ADD CONSTRAINT albums_name_year_key UNIQUE (name, year)"
  );

  pgm.sql("DROP INDEX IF EXISTS songs_title_album_id_unique");
  pgm.sql(
    "ALTER TABLE songs ADD CONSTRAINT songs_title_album_id_key UNIQUE (title, album_id)"
  );

  pgm.sql("DROP INDEX IF EXISTS playlists_name_owner_unique");
  pgm.sql(
    "ALTER TABLE playlists ADD CONSTRAINT playlists_name_owner_key UNIQUE (name, owner)"
  );

  // Drop indexes and columns
  tables.forEach((table) => {
    pgm.dropIndex(table, "deleted_at", {
      name: `idx_${table}_deleted_at`,
    });
    pgm.dropColumn(table, "deleted_at");
  });
};
