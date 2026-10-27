import express from "express";
import { readFile, writeFile } from "fs/promises";
const app = express();
const port = 3000;
const sites = [
  { id: 1, name: "Riverside Community Garden", type: "garden", acres: 2.5 },
  { id: 2, name: "Willow Creek Greenway", type: "riverbank", acres: 8.1 },
  { id: 3, name: "Maple Ridge Park", type: "park", acres: 14.3 },
];

app.get("/", (req, res) => {
  res
    .status(200)
    .json({ message: "Community Conservation Log", version: "1.0" });
});
app.get("/status", (req, res) => {
  res.status(200).json({ status: "ok", uptime: process.uptime() });
});
app.get("/sites", (req, res) => {
  res.set("Cache-Control", "public, max-age=60");
  res.status(200).json(sites);
});
app.get("/sites/:id", (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  const site = sites.find((s) => s.id === id);
  if (site) {
    res.status(200).json(site);
  } else {
    res.status(404).json({ error: "Site not found" });
  }
});
app.set("view engine", "ejs");
app.set("views", "views");
app.get("/dashboard", (req, res) => {
  res.status(200).render("dashboard", { sites });
});
app.use(express.static("public"));
app.use(express.json());

app.get("/logs", async (req, res) => {
  const { siteId } = req.query;
  const data = await readFile("logs.json", "utf-8");
  const logs = JSON.parse(data);
  if (!siteId) {
    res.set("X-Total-Count", logs.length);
    res.status(200).json(logs);
    return;
  }
  const filtered_sites = logs.filter(
    (s) => s.id === Number.parseInt(siteId, 10),
  );
  res.set("X-Total-Count", filtered_sites.length);
  res.status(200).json(filtered_sites);
});

app.post("/logs", express.json(), async (req, res) => {
  const { siteId, action, quantity, unit } = req.body;
  if (!siteId || !action || !quantity || !unit) {
    res
      .status(400)
      .json({ error: "siteId, action, quantity, and unit are required" });
    return;
  }
  const data = await readFile("logs.json", "utf-8");
  const logs = JSON.parse(data);
  const id_list = logs.map((log) => log.id);
  const newId = id_list.length > 0 ? Math.max(...id_list) + 1 : 1;
  const newLog = {
    id: newId,
    siteId: Number.parseInt(siteId, 10),
    action: action,
    quantity: Number.parseFloat(quantity),
    unit: unit,
  };
  logs.push(newLog);
  await writeFile("logs.json", JSON.stringify(logs));
  res.status(201).json(newLog);
});

app.delete("/logs/:id", async (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  const data = await readFile("logs.json", "utf-8");
  const logs = JSON.parse(data);
  const index = logs.findIndex((log) => log.id === id);
  if (index !== -1) {
    logs.splice(index, 1);
    await writeFile("logs.json", JSON.stringify(logs));
    res.status(204).end();
  } else {
    res.status(404).json({ error: "Log not found" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
