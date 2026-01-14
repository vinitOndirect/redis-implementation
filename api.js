const express = require("express");
const todoRoutes = require("./routes/todos/index");
const router = express.Router();

router.use("/todo", todoRoutes);

module.exports = router;
