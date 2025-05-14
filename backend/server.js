const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser")


dotenv.config();


//console.log("Connecting to MongoDB URI:", process.env.MONGO_URI);

const app = express();

app.set('trust proxy', 1)

// Middleware
app.use(cors({
   origin: "http://localhost:3000",
   methods: ["GET", "POST", "PUT", "DELETE"], 
  credentials: true 
}));
app.use(cookieParser())
app.use(express.json());

app.get("/api/test", (req, res) => {
  res.json({ message: "Hello from backend" });
});

// Connect to DB
connectDB();

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));
app.use("/api/users", require("./routes/userRoutes"))

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

