

const express = require("express");
const { authenticate, authorize } = require("../middlewares/auth");
const User = require("../models/User");

const router = express.Router();


router.get("/:id", authenticate,  async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("name email");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


router.get(
  "/",
  authenticate, 
  async (req, res) => {
    try {
      const users = await User.find().select("name email role"); 
      res.json(users);
    } catch (err) {
      console.error("Error fetching users:", err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

module.exports = router;
