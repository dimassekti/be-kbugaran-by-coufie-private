const DatabaseError = require("../exceptions/DatabaseError");
const ClientError = require("../exceptions/ClientError");

/**
 * Categorizes different types of errors and returns appropriate error response
 * @param {Error} error - The error to categorize
 * @returns {Object} - Formatted error response
 */
const categorizeError = (error) => {
  // Database errors (PostgreSQL specific)
  if (error.code && typeof error.code === "string") {
    const dbError = DatabaseError.fromPostgreSQLError(error);
    return {
      statusCode: dbError.statusCode,
      response: {
        status: "fail",
        message: dbError.message,
      },
    };
  }

  // ClientError and its subclasses
  if (error instanceof ClientError) {
    return {
      statusCode: error.statusCode,
      response: {
        status: "fail",
        message: error.message,
      },
    };
  }

  // Joi validation errors
  if (error.isJoi) {
    return {
      statusCode: 400,
      response: {
        status: "fail",
        message: error.details[0].message,
      },
    };
  }

  // Hapi Boom errors
  if (error.isBoom) {
    const { statusCode } = error.output;
    const { message } = error.output.payload;

    return {
      statusCode,
      response: {
        status: statusCode < 500 ? "fail" : "error",
        message: statusCode < 500 ? message : "Terjadi kesalahan pada server",
      },
    };
  }

  // Generic server errors
  return {
    statusCode: 500,
    response: {
      status: "error",
      message: "Terjadi kesalahan pada server",
    },
  };
};

/**
 * Logs error details for debugging
 * @param {Error} error - The error to log
 * @param {Object} request - The Hapi request object
 */
const logError = (error, request = null) => {
  const isDevelopment = process.env.NODE_ENV === "development";

  const logData = {
    timestamp: new Date().toISOString(),
    error: {
      name: error.name,
      message: error.message,
      stack: isDevelopment ? error.stack : undefined,
    },
    request: request
      ? {
          method: request.method,
          path: request.path,
          params: request.params,
          query: request.query,
          headers: {
            "user-agent": request.headers["user-agent"],
            "x-forwarded-for": request.headers["x-forwarded-for"],
          },
        }
      : undefined,
  };

  if (error.statusCode >= 500 || !error.statusCode) {
    console.error("Server Error:", JSON.stringify(logData, null, 2));
  } else if (isDevelopment) {
    console.warn("Client Error:", JSON.stringify(logData, null, 2));
  }
};

/**
 * Parses PostgreSQL error codes and provides user-friendly messages
 * @param {string} errorCode - PostgreSQL error code
 * @param {Object} error - The complete error object
 * @returns {string} - User-friendly error message
 */
const parsePostgreSQLError = (errorCode, error) => {
  const constraint = error.constraint || "";
  const column = error.column || "";
  const table = error.table || "";

  switch (errorCode) {
    case "23505": // unique_violation
      if (constraint.includes("name") || constraint.includes("nama")) {
        return "Nama sudah digunakan, gunakan nama lain";
      }
      if (constraint.includes("email")) {
        return "Email sudah terdaftar";
      }
      if (constraint.includes("username")) {
        return "Username sudah digunakan";
      }
      return "Data sudah ada di sistem";

    case "23503": // foreign_key_violation
      if (table.includes("hospital")) {
        return "Hospital yang direferensikan tidak ditemukan";
      }
      if (table.includes("user")) {
        return "User yang direferensikan tidak ditemukan";
      }
      return "Data yang direferensikan tidak ditemukan";

    case "23502": // not_null_violation
      return `Field ${column} wajib diisi`;

    case "22001": // string_data_right_truncation
      return `Data untuk field ${column} terlalu panjang`;

    case "22007": // invalid_datetime_format
      return "Format tanggal tidak valid";

    case "22P02": // invalid_text_representation
      return "Format data tidak sesuai";

    default:
      return "Terjadi kesalahan pada database";
  }
};

/**
 * Formats error response consistently
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @param {Object} data - Additional error data (optional)
 * @returns {Object} - Formatted error response
 */
const formatErrorResponse = (statusCode, message, data = null) => {
  const response = {
    status: statusCode < 500 ? "fail" : "error",
    message,
  };

  if (data && process.env.NODE_ENV === "development") {
    response.data = data;
  }

  return response;
};

module.exports = {
  categorizeError,
  logError,
  parsePostgreSQLError,
  formatErrorResponse,
};
