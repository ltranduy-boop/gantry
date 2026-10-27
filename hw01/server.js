const stations = [
  { id: 1, name: "Blue Mesa Ridge", biome: "alpine", elevation: 3200 },
  { id: 2, name: "Dusty Flats", biome: "desert", elevation: 890 },
  { id: 3, name: "Pine Harbor", biome: "coastal", elevation: 45 },
];

const readings = [
  { id: 1, stationId: 1, type: "temperature", value: -2.1, unit: "C" },
  { id: 2, stationId: 1, type: "co2", value: 412, unit: "ppm" },
  { id: 3, stationId: 2, type: "temperature", value: 38.4, unit: "C" },
  { id: 4, stationId: 2, type: "humidity", value: 12, unit: "%" },
  { id: 5, stationId: 3, type: "temperature", value: 16.8, unit: "C" },
  { id: 6, stationId: 3, type: "humidity", value: 78, unit: "%" },
];

import express from "express";
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the Environmental Monitoring Station",
    version: "1.0",
  });
});

app.get("/status", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
  });
});
app.get("/stations", (req, res) => {
  res.status(200).json(stations);
});

app.get("/stations/:id", (req, res) => {
  const candidate = stations.find(
    (station) => station.id === parseInt(req.params.id),
  );
  if (!candidate) {
    res.status(404).json({ error: "Station not found" });
  }
  res.status(200).json(candidate);
});

app.get("/readings", (req, res) => {
  if (!req.query.type) {
    res.status(200).json(readings);
  } else {
    res
      .status(200)
      .json(readings.filter((reading) => reading.type === req.query.type));
  }
});

app.set("view engine", "ejs");
app.set("views", "views");

app.get("/dashboard", (req, res) => {
  res.status(200).render("dashboard", { stations, readings });
});

app.get("/stations/:id/view", (req, res) => {
  if (!req.params.id) {
    res.status(400).json({ error: "Station not found" });
  } else if (
    !stations.find((station) => station.id === parseInt(req.params.id))
  ) {
    res.status(404).json({ error: "Station not found" });
  } else {
    const station = stations.find((s) => s.id === parseInt(req.params.id));
    res.status(200).render("station", { station, readings });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
