const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser")
const { Server } = require("socket.io")
const http = require("http"); 
const jwt = require("jsonwebtoken");
// const helmet = require("helmet");
// const rateLimit = require("express-rate-limit");



dotenv.config();


//console.log("Connecting to MongoDB URI:", process.env.MONGO_URI);

const app = express();

app.set('trust proxy', 1)

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: [
    "https://task-manager-appk999.vercel.app",
    "http://localhost:3000"
  ],
  transports: ["polling", "websocket"], 
  timeout: 10000,
    credentials: true,
  },
});

app.set("io", io);

io.use((socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error("Authentication error: no token"));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(new Error("Authentication error: invalid token"));
    }

    socket.userId = decoded.id; 
    next();
  });
});

// Optional: Log connection
io.on("connection", (socket) => {
  console.log("⚡ Socket connected:", socket.id);

   socket.on("join", (userId) => {
    console.log(`User ${userId} joined personal room`);
    socket.join(userId); // Create a personal room for targeted emits
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
  });
});

// Middleware
// app.use(cors({
//   origin: [
//     "http://localhost:3000",
//     "https://task-manager-appk999.vercel.app"
//   ],
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   credentials: true
// }));


const allowedOrigins = [
  "http://localhost:3000",
  "https://task-manager-appk999.vercel.app"
];

app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin like mobile apps or curl
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ["GET", "POST", "PUT", "DELETE"], 
  credentials: true
}));

app.use(cookieParser())
app.use(express.json());



// app.use(helmet());
// app.use(rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 min
//   max: 100, // max requests per IP
// }));


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
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
















// const express = require("express");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const connectDB = require("./config/db");
// const cookieParser = require("cookie-parser")


// dotenv.config();


// //console.log("Connecting to MongoDB URI:", process.env.MONGO_URI);

// const app = express();

// app.set('trust proxy', 1)

// // Middleware
// app.use(cors({
//    origin: "http://localhost:3000",
//    methods: ["GET", "POST", "PUT", "DELETE"], 
//   credentials: true 
// }));
// app.use(cookieParser())
// app.use(express.json());

// app.get("/api/test", (req, res) => {
//   res.json({ message: "Hello from backend" });
// });

// // Connect to DB
// connectDB();

// // Routes
// app.use("/api/auth", require("./routes/authRoutes"));
// app.use("/api/admin", require("./routes/adminRoutes"));
// app.use("/api/tasks", require("./routes/taskRoutes"));
// app.use("/api/users", require("./routes/userRoutes"))

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

