const express = require("express");
const taskController = require("../controller/task.controller");
const authController = require("../controller/auth.controller");
const router = express.Router();

// 모든 할 일의 isComplete 상태를 토글하는 API
router.put("/toggle-all", taskController.toggleAllTasks);

router.post("/", authController.authenticate, taskController.creatTask);

router.get("/", taskController.getTask);

router.put("/:id", taskController.updateTask);

router.delete("/:id", taskController.deleteTask);

module.exports = router;
