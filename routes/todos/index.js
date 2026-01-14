const express = require("express");
const Todo = require("../../models/todos.model");
const redisClient = require("../../redisClient");
const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const cacheKey = "todos:all";

    // 1. Check cache
    console.time("cache");
    const cached = await redisClient.get(cacheKey);
    console.timeEnd("cache");
    if (cached) {
      console.log("Cache hit");
      return res
        .status(200)
        .json({ success: "cached", todos: JSON.parse(cached) });
    }

    // 2. Query DB
    console.time("db");
    const todos = await Todo.findAll({});
    console.timeEnd("db");

    // 3. Store in cache (expire after 60s)
    await redisClient.set(cacheKey, JSON.stringify(todos), "EX", 60);

    return res.status(200).json({ success: "db", todos });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "something went wrong fetching the todos" });
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { title } = req.body;
    const createdTodo = await Todo.create({ title });

    // Invalidate cached list
    await redisClient.del("todos:all");

    // Cache individual todo
    await redisClient.set(
      `todo:${createdTodo.id}`,
      JSON.stringify(createdTodo),
      "EX",
      60
    );

    return res.status(200).json({ success: "created", todo: createdTodo });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "something went wrong creating the todo" });
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const toBeDeleted = await Todo.findByPk(id);

    if (!toBeDeleted) return res.status(404).json({ error: "Not found" });

    await toBeDeleted.destroy();

    // Invalidate cache
    await redisClient.del("todos:all");
    await redisClient.del(`todo:${id}`);

    return res.status(200).json({ success: "deleted" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "something went wrong deleting the todo" });
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    const toBeUpdated = await Todo.findByPk(id);

    if (!toBeUpdated) return res.status(404).json({ error: "Not found" });

    toBeUpdated.title = title;
    await toBeUpdated.save();

    // Update cache
    await redisClient.set(`todo:${id}`, JSON.stringify(toBeUpdated), "EX", 60);
    await redisClient.del("todos:all"); // force refresh list

    return res.status(200).json({ message: "updated", todo: toBeUpdated });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "something went wrong updating the todo" });
  }
});

module.exports = router;
