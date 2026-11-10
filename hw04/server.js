const trees = [
  {
    treeId: "ACRU-01",
    species: "Red Maple",
    latinName: "Acer Rubrum",
    site: "Locust Opening Rd.",
  },
  {
    treeId: "ACRU-03",
    species: "Red Maple",
    latinName: "Acer Rubrum",
    site: "Causeway Rd.",
  },
  {
    treeId: "QURU-01",
    species: "Red Oak",
    latinName: "Quercus Rubra",
    site: "Locust Opening Rd.",
  },
  {
    treeId: "QURU-03",
    species: "Red Oak",
    latinName: "Quercus Rubra",
    site: "Prospect Hill Rd.",
  },
  {
    treeId: "BEPA-05",
    species: "Paper Birch",
    latinName: "Betula Papyrifera",
    site: null,
  },
  {
    treeId: "BEPA-07",
    species: "Paper Birch",
    latinName: "Betula Papyrifera",
    site: null,
  },
  {
    treeId: "FAGR-01",
    species: "Beech",
    latinName: "Fagus Grandifolia",
    site: "Locust Opening Rd.",
  },
  {
    treeId: "FAGR-04",
    species: "Beech",
    latinName: "Fagus Grandifolia",
    site: "Prospect Hill Rd.",
  },
];
import express from "express";
import mongoose from "mongoose";
import observationRouter from "./routes/observations-routes.js";
import { getObservation } from "./services/observations-service.js";

const app = express();
const PORT = process.env.PORT || 3000;
await mongoose.connect(
  process.env.MONGODB_URI ||
    "mongodb://dev:devpassword@mongo:27017/devdb?authSource=admin",
);

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome" });
});

app.get("/status", (req, res) => {
  res
    .status(200)
    .json({ message: "Harvard Forest Phenology Tracker", version: "1.0" });
});

app.get("/trees", (req, res) => {
  res.status(200).json(trees);
});

app.get("/trees/:treeId", (req, res) => {
  const treeId = String(req.params.treeId);
  const tree = trees.find((x) => x.treeId === treeId);
  if (!tree) {
    return res.status(404).json({ error: "No matching tree" });
  }
  res.status(200).json(tree);
});

app.get("/dashboard", async (req, res) => {
  const observations = await getObservation();
  res.status(200).render("dashboard", { trees, observations });
});

app.use("/observations", observationRouter);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
