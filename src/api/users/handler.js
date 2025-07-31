const ClientError = require("../../exceptions/ClientError");
const InvariantError = require("../../exceptions/InvariantError");

class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postUserHandler = this.postUserHandler.bind(this);
    this.getUserByIdHandler = this.getUserByIdHandler.bind(this);
    this.getCurrentUserHandler = this.getCurrentUserHandler.bind(this);
    this.getAllUsersHandler = this.getAllUsersHandler.bind(this);
    this.deleteUserHandler = this.deleteUserHandler.bind(this);
    this.updateUserRoleHandler = this.updateUserRoleHandler.bind(this);
    this.getUserByUsernameHandler = this.getUserByUsernameHandler.bind(this);
  }

  async postUserHandler(request, h) {
    this._validator.validateUserPayload(request.payload);
    const { username, password, fullname, role } = request.payload;

    // Check if role parameter is provided and user is authenticated as admin
    let userRole = "member"; // default role
    if (role && request.auth && request.auth.credentials) {
      // Safely extract the authenticated user's role
      const { role: authUserRole } = request.auth.credentials || {};

      if (authUserRole === "admin") {
        // Prevent creation of admin users
        if (role === "admin") {
          throw new InvariantError("Cannot create admin users");
        }
        userRole = role;
      }
    }

    const userId = await this._service.addUser({
      username,
      password,
      fullname,
      role: userRole,
    });

    const response = h.response({
      status: "success",
      message: "User berhasil ditambahkan",
      data: {
        userId,
      },
    });
    response.code(201);
    return response;
  }

  async getUserByIdHandler(request, h) {
    const { id } = request.params;

    const user = await this._service.getUserById(id);

    return {
      status: "success",
      data: {
        user,
      },
    };
  }

  async getCurrentUserHandler(request, h) {
    const { id } = request.auth.credentials;

    // Debug logging
    console.log("JWT credentials:", request.auth.credentials);
    console.log("Extracted user ID:", id);

    const user = await this._service.getUserByIdWithRole(id);

    return {
      status: "success",
      data: {
        user,
      },
    };
  }

  async getAllUsersHandler(request, h) {
    const users = await this._service.getAllUsers();

    return {
      status: "success",
      data: {
        users,
      },
    };
  }

  async deleteUserHandler() {
    // Return disabled response instead of actually deleting the user
    return {
      status: "disabled",
      message: "User deletion is currently disabled for safety reasons",
    };
  }

  async updateUserRoleHandler(request, h) {
    this._validator.validateUserRoleUpdatePayload(request.payload);

    const { id } = request.params;
    const { role } = request.payload;

    await this._service.updateUserRole(id, role);

    return {
      status: "success",
      message: "Role user berhasil diperbarui",
    };
  }

  async getUserByUsernameHandler(request) {
    const { username } = request.params;

    if (!username || !username.trim()) {
      throw new ClientError("Username is required");
    }

    const user = await this._service.getUserByUsername(username.trim());

    return {
      status: "success",
      data: {
        user,
      },
    };
  }
}
module.exports = UsersHandler;
