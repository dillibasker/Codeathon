// AI-Powered Virtual Assistant for Elderly Care

// Backend: Node.js + Express + MongoDB
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const socketIo = require("socket.io");
const http = require("http");
const { detectAnomalies } = require("./aiModel");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

app.use(cors());
app.use(bodyParser.json());

mongoose.connect("mongodb://localhost:27017/elderlyCare", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const UserSchema = new mongoose.Schema({
  name: String,
  age: Number,
  medications: [{ name: String, time: String }],
  vitals: { heartRate: Number, bloodPressure: String },
  caregiver: String,
});

const User = mongoose.model("User", UserSchema);

// Medication Reminder Endpoint
app.get("/reminders/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user.medications);
});

// Vital Signs Update Endpoint
app.post("/update-vitals/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  user.vitals = req.body;
  await user.save();
  const anomaly = detectAnomalies(req.body);
  if (anomaly) {
    io.emit("alert", { userId: req.params.id, message: "Anomaly detected!" });
  }
  res.json({ message: "Vitals updated" });
});

io.on("connection", (socket) => {
  console.log("Client connected");
});

server.listen(5000, () => console.log("Server running on port 5000"));2
