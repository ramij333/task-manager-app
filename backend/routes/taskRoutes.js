const express = require("express");
const { authenticate, authorize } = require("../middlewares/auth");
const Task = require("../models/Task");
const User = require("../models/User");

const router = express.Router();

// Create Task (Any logged-in user)
router.post("/", authenticate, async (req, res) => {
  try {
    const { title, description, dueDate, priority, recurring, recurringType } = req.body;

    const newTask = new Task({
      title,
      description,
      dueDate,
      priority,
      creatorId: req.user._id, 
      recurring,
      recurringType,
    });

    await newTask.save();
    //res.status(201).json(newTask);
    res.status(201).json({
  ...newTask.toObject(),
  id: newTask._id.toString(),
});
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get Tasks for Current User (Creator or Assignee)
router.get("/", authenticate, async (req, res) => {
  try {
    const now = new Date();

    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const startOfWeek = new Date(startOfDay);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Sunday
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const tasks = await Task.find({
      $or: [{ creatorId: req.user._id }, { assigneeId: req.user._id }],
    }).lean();

    const filtered = tasks.map(task => {
      if (task.recurring && Array.isArray(task.completedDates)) {
        const completedToday = task.completedDates.some(d => {
          const completedDate = new Date(d);
          if (task.recurringType === "daily") {
            return completedDate.getTime() === startOfDay.getTime();
          } else if (task.recurringType === "weekly") {
            return completedDate >= startOfWeek;
          } else if (task.recurringType === "monthly") {
            return (
              completedDate.getFullYear() === startOfMonth.getFullYear() &&
              completedDate.getMonth() === startOfMonth.getMonth()
            );
          }
          return false;
        });

        return { ...task, completedThisCycle: completedToday };
      }

      return { ...task, completedThisCycle: false };
    });

   // res.json(filtered);
   res.json(
  filtered.map(task => ({
    ...task,
    id: task._id.toString(),
  }))
);

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Update Task (Only creator or admin/manager)
router.put("/:id", authenticate, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });

   
    const isOwner = task.creatorId.toString() === req.user._id.toString();
    const isAdminOrManager = ["admin", "manager"].includes(req.user.role);

    if (!isOwner && !isAdminOrManager) {
      return res.status(403).json({ message: "Forbidden: You can only update your own tasks" });
    }

   
    if (task.status === "completed") {
      return res.status(403).json({ message: "Cannot edit a completed task" });
    }

    const {
      title,
      description,
      dueDate,
      priority,
      status,
      assigneeId,
      recurring,
      recurringType,
    } = req.body;

    task.title = title || task.title;
    task.description = description || task.description;
    task.dueDate = dueDate || task.dueDate;
    task.priority = priority || task.priority;
    task.status = status || task.status;
    task.assigneeId = assigneeId || task.assigneeId;
    task.recurring = recurring !== undefined ? recurring : task.recurring;
    task.recurringType = recurringType || task.recurringType;

    await task.save();
    //res.json(task);
    res.json({
  ...task.toObject(),
  id: task._id.toString(),
});

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


// Assign Task (Admin and Manager Only)

router.put("/:id/assign", authenticate, authorize("admin", "manager"), async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const { assigneeEmail } = req.body;
    if (!assigneeEmail) return res.status(400).json({ message: "Assignee email is required" });

    // Find the user by email
    const user = await User.findOne({ email: assigneeEmail });
    if (!user) return res.status(404).json({ message: "User not found with this email" });

    task.assigneeId = user._id;
    await task.save();

    res.json({
      ...task.toObject(),
      id: task._id.toString(),
    });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});







// router.put("/:id/assign", authenticate, authorize("admin", "manager"), async (req, res) => {
//   try {
//     const task = await Task.findById(req.params.id);

//     if (!task) return res.status(404).json({ message: "Task not found" });

//     task.assigneeId = req.body.assigneeId; // Assign to the user
//     await task.save();
//     //res.json(task);
//     res.json({
//   ...task.toObject(),
//   id: task._id.toString(),
// });

//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });



router.put("/:id/complete", authenticate, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Check permission: only creator or assignee can mark complete
    if (
      task.creatorId.toString() !== req.user._id.toString() &&
      task.assigneeId?.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized to complete this task" });
    }

    // Normalize today's date to 00:00:00
    const today = new Date();
    const normalizedToday = new Date(today.setHours(0, 0, 0, 0));

    // Prevent completing before the current due date (optional but recommended)
    if (
      task.recurring &&
      normalizedToday < new Date(task.dueDate).setHours(0, 0, 0, 0)
    ) {
      return res.status(400).json({
        message: "You cannot complete this recurring task before its due date.",
      });
    }

    // Check if already completed for today
    const alreadyCompleted = task.completedDates?.some(
      (date) => new Date(date).getTime() === normalizedToday.getTime()
    );

    if (alreadyCompleted) {
      return res.status(400).json({
        message: "Task already completed for today. Wait until the next recurrence.",
      });
    }

    // Add today's completion
    task.completedDates = task.completedDates || [];
    task.completedDates.push(normalizedToday);

    // Mark non-recurring tasks as fully completed
    if (!task.recurring) {
      task.status = "completed";
    } else {
      // Optional: update the dueDate to the next recurring date
      const currentDue = new Date(task.dueDate);
      let nextDue = new Date(currentDue);

      switch (task.recurringType) {
        case "daily":
          nextDue.setDate(currentDue.getDate() + 1);
          break;
        case "weekly":
          nextDue.setDate(currentDue.getDate() + 7);
          break;
        case "monthly":
          nextDue.setMonth(currentDue.getMonth() + 1);
          break;
        default:
          // If recurringType is invalid or missing
          return res.status(400).json({ message: "Invalid recurring type." });
      }

      task.dueDate = nextDue;
    }

    await task.save();

    res.json({
      message: "Task marked as complete",
      task: {
        ...task.toObject(),
        id: task._id.toString(),
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});






// router.put("/:id/complete", authenticate, async (req, res) => {
//   try {
//     const task = await Task.findById(req.params.id);
//     if (!task) return res.status(404).json({ message: "Task not found" });

//     // Check permission: only assignee or creator can mark complete
//     if (
//       task.creatorId.toString() !== req.user._id.toString() &&
//       task.assigneeId?.toString() !== req.user._id.toString()
//     ) {
//       return res.status(403).json({ message: "Not authorized to complete this task" });
      
//     }

//     // Set today's date at 00:00:00 for consistency
//     const today = new Date();
//     const normalizedToday = new Date(today.setHours(0, 0, 0, 0));

//     // Prevent duplicate entries
//     const alreadyCompleted = task.completedDates?.some(
//       date => new Date(date).getTime() === normalizedToday.getTime()
//     );

//     if (!alreadyCompleted) {
//       task.completedDates = task.completedDates || [];
//       task.completedDates.push(normalizedToday);
//     }

//     // Optionally mark non-recurring tasks as fully completed
//     if (!task.recurring) {
//       task.status = "completed";
//     }

//     await task.save();
//     //res.json({ message: "Task marked as complete", task });
//     res.json({
//   message: "Task marked as complete",
//   task: {
//     ...task.toObject(),
//     id: task._id.toString(),
//   },
// });

//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });



// Delete Task (Only creator or admin/manager)
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    const isCreator = task.creatorId.toString() === req.user._id.toString();
    const isAdminOrManager = ["admin", "manager"].includes(req.user.role);

    // Prevent regular users from deleting tasks assigned to them
    if (!isCreator && !isAdminOrManager) {
      return res.status(403).json({
        message: "Forbidden: You can only delete tasks you created or if you're an admin/manager",
      });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


module.exports = router;
