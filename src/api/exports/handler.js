const ClientError = require("../../exceptions/ClientError");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const AuthorizationError = require("../../exceptions/AuthorizationError");

class ExportsHandler {
  constructor(service, playlistsService, validator) {
    this._service = service;
    this._playlistsService = playlistsService;
    this._validator = validator;

    this.postExportPlaylistsHandler =
      this.postExportPlaylistsHandler.bind(this);
    this.postExportPlaylistByIdHandler =
      this.postExportPlaylistByIdHandler.bind(this);
    this.getExportPlaylistByIdHandler =
      this.getExportPlaylistByIdHandler.bind(this);
  }

  async postExportPlaylistByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const { id: credentialId } = request.auth.credentials;
      this._validator.validateExportPayload(request.payload);
      await this._playlistsService.verifyPlaylistAccess(id, credentialId);
      const message = {
        userId: credentialId,
        playlistId: id,
        targetEmail: request.payload.targetEmail,
      };
      await this._service.sendMessage(
        "export:playlists",
        JSON.stringify(message)
      );
      const response = h.response({
        status: "success",
        message: "Permintaan Anda dalam antrean",
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      throw error;
    }
  }

  async postExportPlaylistsHandler(request, h) {
    try {
      this._validator.validateExportPayload(request.payload);
      const message = {
        userId: request.auth.credentials.id,
        targetEmail: request.payload.targetEmail,
      };
      await this._service.sendMessage(
        "export:playlists",
        JSON.stringify(message)
      );
      const response = h.response({
        status: "success",
        message: "Permintaan Anda dalam antrean",
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      throw error;
    }
  }

  async getExportPlaylistByIdHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    try {
      // Verify playlist access which will throw appropriate errors
      await this._playlistsService.verifyPlaylistAccess(id, credentialId);

      // If we reach here, the playlist exists and user has access
      // Return a 400 error as per requirements
      throw new InvariantError("Export endpoint not implemented");
    } catch (error) {
      // Convert any error to a 400 Bad Request with fail status
      const response = h.response({
        status: "fail",
        message: error.message || "Resource tidak ditemukan",
      });
      response.code(400);
      return response;
    }
  }
}

module.exports = ExportsHandler;
