const redis = require("redis");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");

class CacheService {
  constructor() {
    if (process.env.REDIS_SERVER) {
      this._client = redis.createClient({
        socket: {
          host: process.env.REDIS_SERVER,
        },
      });
      this._client.on("error", (error) => {
        console.error(error);
      });
      this._client.connect();
      this._enabled = true;
    } else {
      this._enabled = false;
      this._client = null;
      console.warn("Redis is disabled: REDIS_SERVER env not set.");
    }
  }

  async set(key, value, expirationInSecond = 1800) {
    if (!this._enabled) throw new InvariantError("Redis tidak tersedia");
    try {
      await this._client.set(key, value, {
        EX: expirationInSecond,
      });
    } catch (error) {
      throw new InvariantError("Gagal menyimpan cache");
    }
  }

  async get(key) {
    if (!this._enabled) throw new InvariantError("Redis tidak tersedia");
    try {
      const result = await this._client.get(key);
      if (result === null) throw new NotFoundError("Cache tidak ditemukan");
      return result;
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new InvariantError("Gagal mengambil cache");
    }
  }

  delete(key) {
    if (!this._enabled) throw new InvariantError("Redis tidak tersedia");
    try {
      return this._client.del(key);
    } catch (error) {
      throw new InvariantError("Gagal menghapus cache");
    }
  }
}

module.exports = CacheService;
