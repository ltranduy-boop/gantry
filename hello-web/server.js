import express from "express";
import { join } from "path";

const app = express();
const PORT = 3000;
app.use(express.static("public"));
app.use(function (req, res, next) {
  console.log("Calling");
  next();
});

app.set("view engine", "ejs");
app.set("views", "views");

app.get("/", (req, res) => {
  res.sendFile(join(import.meta.dirname, "public", "lmao.html"));
});
app.get("/", (req, res) => {
  res.sendFile(join(import.meta.dirname, "public", "index.html"));
});
app.get("/picture", (req, res) => {
  res.sendFile(join(import.meta.dirname, "public", "6599197.jpg"));
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});

app.get("/entries", (req, res) => {
  const entries = [
    { title: req.query.a || "First note" },
    { title: req.query.b || "Second note" },
  ];
  res.render("entries", { title: "My Notes", entries });
});

app.get("/events", (req, res) => {
  let events = [];
  if (!req.query.a && !req.query.b) {
    events = [];
  } else if (!req.query.a) {
    events = [{ title: req.query.b }];
  } else if (!req.query.b) {
    events = [{ title: req.query.a }];
  } else {
    events = [{ title: req.query.a }, { title: req.query.b }];
  }
  res.render("events", { title: "My Events", events });
});

app.get("/search", (req, res) => {
  const pair = {
    term: req.query.term || "No search term provided",
    limit: req.query.limit || "0",
  };
  res.json(pair);
});

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

app.get("/slow", async (req, res) => {
  await wait(5000);
  res.send("Done waiting.");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
// work in progress
// step one
// step two
// step three
// checkpoint 1
// checkpoint 2
// checkpoint 3
// BUG: off-by-one introduced here
// checkpoint 4
// checkpoint 5
