const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/iot_data", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const SensorDataSchema = new mongoose.Schema({
  timestamp: String,
  temperature: Number,
  power_output: Number,
});

const SensorData = mongoose.model("SensorData", SensorDataSchema);

app.get("/data", async (req, res) => {
  const data = await SensorData.find();
  res.json(data);
});

app.get("/predict", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:5001/predict");
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Prediction service unavailable" });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
