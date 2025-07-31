const ClientError = require("./ClientError");

class DatabaseError extends ClientError {
  constructor(message, statusCode = 400) {
    super(message, statusCode);
    this.name = "DatabaseError";
  }

  static fromPostgreSQLError(error) {
    // PostgreSQL error codes
    const errorCode = error.code;

    switch (errorCode) {
      case "23505": // unique_violation
        if (error.constraint && error.constraint.includes("name")) {
          return new DatabaseError("Hospital dengan nama tersebut sudah ada");
        }
        if (error.constraint && error.constraint.includes("email")) {
          return new DatabaseError("Email sudah digunakan");
        }
        return new DatabaseError("Data sudah ada di sistem");

      case "23503": // foreign_key_violation
        return new DatabaseError("Data yang direferensikan tidak ditemukan");

      case "23502": {
        // not_null_violation
        const column = error.column || "field";
        return new DatabaseError(`Field ${column} tidak boleh kosong`);
      }

      case "22001": // string_data_right_truncation
        return new DatabaseError(
          "Data terlalu panjang untuk field yang tersedia"
        );

      case "22007": // invalid_datetime_format
        return new DatabaseError("Format tanggal atau waktu tidak valid");

      case "22P02": // invalid_text_representation
        return new DatabaseError("Format data tidak valid");

      case "08001": // connection_failure
      case "08006": // connection_failure
        return new DatabaseError("Koneksi ke database gagal", 503);

      default:
        // For unknown database errors, provide a generic message
        return new DatabaseError("Terjadi kesalahan pada database");
    }
  }
}

module.exports = DatabaseError;
