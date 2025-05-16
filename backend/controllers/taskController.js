const Task = require('../models/Task');
const User = require('../models/User')

exports.createTask = async (req, res) => {
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

    const io = req.app.get("io");
    if (io) {
        io.to(newTask.creatorId.toString()).emit("task-created" , {
            taskId: newTask._id.toString(),
            title: newTask.title
        })
    }

    res.status(201).json({
      ...newTask.toObject(),
      id: newTask._id.toString(),
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


exports.getTasks = async (req, res) => {
  try {
    const { status, priority, dueDate, search } = req.query;

    const userAccessFilter = {
      $or: [
        { creatorId: req.user._id },
        { assigneeId: req.user._id }
      ]
    };

    const filter = [userAccessFilter];

    if (status) {
      filter.push({ status });
    }

    if (priority) {
      filter.push({ priority });
    }

    if (dueDate) {
      const targetDate = new Date(dueDate);
      const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));
      filter.push({ dueDate: { $gte: startOfDay, $lte: endOfDay } });
    }

    if (search) {
      filter.push({
        $or: [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } }
        ]
      });
    }

    const tasks = await Task.find({ $and: filter }).lean();

    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const startOfWeek = new Date(startOfDay);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);


    const result = tasks.map(task => {
  let completedToday = false;
  const dueDate = new Date(task.dueDate);
  const normalizedDue = new Date(dueDate.setHours(0, 0, 0, 0));

  if (task.recurring && Array.isArray(task.completedDates)) {
    const today = new Date();
    const normalizedToday = new Date(today.setHours(0, 0, 0, 0));

    if (task.recurringType === "daily") {
      completedToday = task.completedDates.some(date => {
        const completedDate = new Date(date).setHours(0, 0, 0, 0);
        return completedDate === normalizedToday.getTime();
      });
    } else if (task.recurringType === "weekly") {
      const startOfWeek = new Date(normalizedToday);
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      completedToday = task.completedDates.some(date => {
        const completedDate = new Date(date);
        return completedDate >= startOfWeek;
      });
    } else if (task.recurringType === "monthly") {
      const startOfMonth = new Date(normalizedToday.getFullYear(), normalizedToday.getMonth(), 1);
      completedToday = task.completedDates.some(date => {
        const completedDate = new Date(date);
        return (
          completedDate.getFullYear() === startOfMonth.getFullYear() &&
          completedDate.getMonth() === startOfMonth.getMonth()
        );
      });
    }

    if (!completedToday && normalizedToday.getTime() === normalizedDue.getTime()) {
      task.status = "pending";
    }

    return { ...task, completedThisCycle: completedToday };
  }

  return { ...task, completedThisCycle: false };
});


    // const result = tasks.map(task => {
    //   if (task.recurring && Array.isArray(task.completedDates)) {
    //     const completedToday = task.completedDates.some(date => {
    //       const completedDate = new Date(date);
    //       if (task.recurringType === "daily") {
    //         return completedDate.getTime() === startOfDay.getTime();
    //       } else if (task.recurringType === "weekly") {
    //         return completedDate >= startOfWeek;
    //       } else if (task.recurringType === "monthly") {
    //         return (
    //           completedDate.getFullYear() === startOfMonth.getFullYear() &&
    //           completedDate.getMonth() === startOfMonth.getMonth()
    //         );
    //       }
    //       return false;
    //     });

    //     return { ...task, completedThisCycle: completedToday };
    //   }

    //   return { ...task, completedThisCycle: false };
    // });

    res.json(result.map(task => ({
      ...task,
      id: task._id.toString(),
    })));
  } catch (err) {
    console.error("GET /tasks error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};



exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    const isOwner = task.creatorId.toString() === req.user._id.toString();
    const isAdminOrManager = ["admin", "manager"].includes(req.user.role);

    if (!isOwner && !isAdminOrManager) {
      return res.status(403).json({
        message: "Forbidden: You can only update your own tasks",
      });
    }

    if (task.status === "completed") {
      return res.status(403).json({
        message: "Cannot edit a completed task",
      });
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

    const io = req.app.get("io");
    const currentUserId = req.user._id;
    const currentAssigneeId = task.assigneeId?.toString();

    if (
      io &&
      currentAssigneeId &&
      currentAssigneeId !== currentUserId // Only notify if creator/admin is not assignee
    ) {
      io.to(currentAssigneeId).emit("task-updated", {
        taskId: task._id.toString(),
        title: task.title,
        updatedBy: req.user.email,
      });
    }

    res.json({
      ...task.toObject(),
      id: task._id.toString(),
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};




exports.assignTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // 1. Block assigning already assigned task
    if (task.assigneeId) {
      return res.status(400).json({ message: "Task is already assigned and cannot be reassigned" });
    }

    // 2. Block assigning completed tasks (regardless of recurring type)
    if (task.status === "completed") {
      return res.status(400).json({ message: "Completed task cannot be assigned" });
    }

    const { assigneeEmail } = req.body;
    if (!assigneeEmail) {
      return res.status(400).json({ message: "Assignee email is required" });
    }

    const normalizedEmail = assigneeEmail.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail }); // ✅ Declare before using

    if (!user) {
      return res.status(404).json({ message: "User not found with this email" });
    }

    // 3. Prevent assigning task to yourself
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot assign a task to yourself" });
    }

    task.assigneeId = user._id;
    await task.save();

    const isDifferentUser = task.creatorId.toString() !== user._id.toString();
    const io = req.app.get("io");
    if (io && isDifferentUser) {
      io.to(user._id.toString()).emit("task-assigned", {
        taskId: task._id.toString(),
        title: task.title,
        assignedBy: req.user.email,
      });
    }

    res.json({
      ...task.toObject(),
      id: task._id.toString(),
    });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};





// exports.assignTask = async (req, res) => {
//   try {
//     const task = await Task.findById(req.params.id);
//     if (!task) return res.status(404).json({ message: "Task not found" });

//     const { assigneeEmail } = req.body;
//     const normalizedEmail = assigneeEmail.toLowerCase();
//     if (!normalizedEmail)
//       return res.status(400).json({ message: "Assignee email is required" });

//     const user = await User.findOne({ email: normalizedEmail });
//     if (!user)
//       return res.status(404).json({ message: "User not found with this email" });

//     if (task.status === 'completed' && (task.recurring && task.completedDates.length > 0))
//         return res.status(400).json({message: "Completed task cant be assigned"})

//     task.assigneeId = user._id;
    
//     await task.save();

//     // Only emit if creator and assignee are different
//     const isDifferentUser = task.creatorId.toString() !== user._id.toString();

//     const io = req.app.get("io");
//     if (io && isDifferentUser) {
//       io.to(user._id.toString()).emit("task-assigned", {
//         taskId: task._id.toString(),
//         title: task.title,
//         assignedBy: req.user.email,
//       });
//     }

//     res.json({
//       ...task.toObject(),
//       id: task._id.toString(),
//     });
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };


exports.completeTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

     const isCreator = task.creatorId.toString() === req.user._id.toString();
    const isAssignee = task.assigneeId?.toString() === req.user._id.toString();

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
    task.status = "completed";
    // Mark non-recurring tasks as fully completed
    if (task.recurring) {
      const currentDue = new Date(task.dueDate);
      const baseDate = normalizedToday > currentDue ? normalizedToday : currentDue;
      let nextDue = new Date(currentDue.getTime());

      switch (task.recurringType) {
        case "daily":
          nextDue.setDate(baseDate.getDate() + 1); //currentdue.getDate()
          break;
        case "weekly":
          nextDue.setDate(baseDate.getDate() + 7);
          break;
        case "monthly":
          nextDue.setMonth(baseDate.getMonth() + 1);
          break;
        default:
          // If recurringType is invalid or missing
          return res.status(400).json({ message: "Invalid recurring type." });
      }

      task.dueDate = nextDue;
    }

    await task.save();

     const io = req.app.get("io");
    if (io && isAssignee && !isCreator) {
      io.to(task.creatorId.toString()).emit("task-completed", {
        taskId: task._id.toString(),
        title: task.title,
        completedBy: req.user.email,
      });
    }

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
}


exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    const userId = req.user._id.toString();
    const isCreator = task.creatorId.toString() === userId;
    const isAssignee = task.assigneeId?.toString() === userId;
    const isAdmin = req.user.role === "admin";
    const isManager = req.user.role === "manager";

    if (isAdmin) {
      // Admin can delete any task
      await task.deleteOne();
      return res.json({ message: "Task deleted" });
    }

    if (isCreator && !isAssignee) {
      // Manager or Regular User can delete their own created task only if it's not assigned to them
      await task.deleteOne();
      return res.json({ message: "Task deleted" });
    }

    return res.status(403).json({
      message: "Forbidden: You can only delete tasks you created (not assigned ones), unless you're an admin.",
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};



// exports.deleteTask = async (req, res) => {
//   try {
//     const task = await Task.findById(req.params.id);

//     if (!task) return res.status(404).json({ message: "Task not found" });

//     const isCreator = task.creatorId.toString() === req.user._id.toString();
//     const isAdminOrManager = ["admin", "manager"].includes(req.user.role);

//     // Prevent regular users from deleting tasks assigned to them
//     if (!isCreator && !isAdminOrManager) {
//       return res.status(403).json({
//         message: "Forbidden: You can only delete tasks you created or if you're an admin/manager",
//       });
//     }

//     await Task.findByIdAndDelete(req.params.id);
//     res.json({ message: "Task deleted" });
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// }









// router.get("/", authenticate, async (req, res) => {
//   try {
//     const now = new Date();

//     const startOfDay = new Date(now.setHours(0, 0, 0, 0));
//     const startOfWeek = new Date(startOfDay);
//     startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Sunday
//     const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

//     const tasks = await Task.find({
//       $or: [{ creatorId: req.user._id }, { assigneeId: req.user._id }],
//     }).lean();

//     const filtered = tasks.map(task => {
//       if (task.recurring && Array.isArray(task.completedDates)) {
//         const completedToday = task.completedDates.some(d => {
//           const completedDate = new Date(d);
//           if (task.recurringType === "daily") {
//             return completedDate.getTime() === startOfDay.getTime();
//           } else if (task.recurringType === "weekly") {
//             return completedDate >= startOfWeek;
//           } else if (task.recurringType === "monthly") {
//             return (
//               completedDate.getFullYear() === startOfMonth.getFullYear() &&
//               completedDate.getMonth() === startOfMonth.getMonth()
//             );
//           }
//           return false;
//         });

//         return { ...task, completedThisCycle: completedToday };
//       }

//       return { ...task, completedThisCycle: false };
//     });

//    // res.json(filtered);
//    res.json(
//   filtered.map(task => ({
//     ...task,
//     id: task._id.toString(),
//   }))
// );

//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });





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