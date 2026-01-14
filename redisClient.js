// redis.js
const Redis = require("ioredis");

const redisClient = new Redis({
  host: process.env.REDIS_HOST || "db",
  port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
  // password: process.env.REDIS_PASSWORD,
});

module.exports = redisClient;
