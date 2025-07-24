const redis = require("redis");

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
    if (!this._enabled) throw new Error("Redis is disabled.");
    await this._client.set(key, value, {
      EX: expirationInSecond,
    });
  }

  async get(key) {
    if (!this._enabled) throw new Error("Redis is disabled.");
    const result = await this._client.get(key);
    if (result === null) throw new Error("Cache tidak ditemukan");
    return result;
  }

  delete(key) {
    if (!this._enabled) throw new Error("Redis is disabled.");
    return this._client.del(key);
  }
}

module.exports = CacheService;
