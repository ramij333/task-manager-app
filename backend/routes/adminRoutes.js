const express = require("express");
const { authenticate, authorize } = require("../middlewares/auth");
const User = require("../models/User");

const router = express.Router();

// Admin updates role of a user
router.put(
  "/users/:id/role",
  authenticate,
  authorize("admin"),
  async (req, res) => {
   
    const { role } = req.body;
    
    // Validate role input
    if (!["admin", "manager", "user"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    try {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { role },
        { new: true }
      );

      if (!user) return res.status(404).json({ message: "User not found" });

      res.json({ message: "Role updated", user });
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  }
);

// GET /users/:id

module.exports = router;



