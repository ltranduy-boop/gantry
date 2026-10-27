import express from "express";
import { readFile, writeFile } from "node:fs/promises";
import readingsRouter from "./routes/readings-routes.js";
const app = express();
const port = 3000;

const cities = [
  { id: 1, name: "Minneapolis", state: "MN" },
  { id: 2, name: "Toronto", state: "ON" },
  { id: 3, name: "Detroit", state: "MI" },
  { id: 4, name: "New York City", state: "NY" },
  { id: 5, name: "Scranton", state: "PA" },
];

app.use(express.static("public"));
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", "views");
app.get("/", (req, res) => {
  res.status(200).json({ message: "Air Quality Watch", version: "1.0" });
});

app.get("/status", (req, res) => {
  res.status(200).json({ status: "ok", uptime: process.uptime() });
});

app.get("/cities/", (req, res) => {
  res.status(200).json(cities);
});

app.get("/cities/:id", (req, res) => {
  const cityId = parseInt(req.params.id);
  const city = cities.find((c) => c.id === cityId);
  if (city) {
    res.status(200).json(city);
  } else {
    res.status(404).json({ error: "City not found" });
  }
});

app.get("/dashboard", async (req, res) => {
  const DATA_FILE = await readFile("readings.json", "utf-8");
  const readings = JSON.parse(DATA_FILE);
  res.render("dashboard", { cities, readings });
});

app.post("/dashboard", express.json(), async (req, res) => {
  const DATA_FILE = await readFile("readings.json", "utf-8");
  const readings = JSON.parse(DATA_FILE);
  const newReading = {};
  newReading.cityId = parseInt(req.body.cityId);
  newReading.aqi = parseInt(req.body.aqi);
  newReading.id = readings.length + 1;
  readings.push(newReading);
  await writeFile("readings.json", JSON.stringify(readings, null, 2));
  res.status(201).json(newReading);
});
app.use("/readings", readingsRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
