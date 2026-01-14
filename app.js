require("dotenv").config();
const express = require("express");

const routes = require("./api");
const app = express();
const sequelize = require("./database");
const redisClient = require("./redisClient");
const rateLimit = require("express-rate-limit");
const { default: RedisStore } = require("rate-limit-redis");

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // limit each IP to 100 requests per window
  standardHeaders: true, // send rate limit info in headers
  legacyHeaders: false, // disable X-RateLimit headers
  store: new RedisStore({
    sendCommand: (...args) => redisClient.call(...args),
  }),
});

app.use(limiter);

app.use(express.json());
app.use("/public", express.static("/public"));
app.use("/ping", (req, res) => res.send("pong"));

app.use("/api", routes);

sequelize
  .sync({ force: false, alter: false })
  .then(async () => {
    console.log("Database synced");
  })
  .catch((err) => {
    console.log("Error syncing database:", err);
  });

module.exports = app;
