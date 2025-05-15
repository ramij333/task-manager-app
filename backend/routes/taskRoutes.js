const express = require("express");
const { authenticate, authorize } = require("../middlewares/auth");
const Task = require("../models/Task");
const User = require("../models/User");
const {createTask, getTasks, updateTask, completeTask, deleteTask, assignTask} = require("../controllers/taskController")

const router = express.Router();



// Create Task (Any logged-in user)
router.post('/', authenticate, createTask)

// Get Tasks for Current User (Creator or Assignee)

router.get('/', authenticate, getTasks);

// Update Task (Only creator or admin/manager)
router.put("/:id", authenticate, updateTask);

// Assign Task (Admin and Manager Only)

router.put(
  "/:id/assign",
  authenticate,
  authorize("admin", "manager"),
  assignTask 
);


router.put("/:id/complete", authenticate, completeTask);

// Delete Task (Only creator or admin/manager)
router.delete("/:id", authenticate, deleteTask);


module.exports = router;
