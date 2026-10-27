import express from "express";

const app = express();
const PORT = 3000;
const projects = [
  { name: "Weather app", tag: "javascript" },
  { name: "Minecraft", tag: "javascript" },
  { name: "Portfolio site", tag: "express" },
  { name: "Budget tracker", tag: "python" },
];
app.get("/", (req, res) => {
  res.send("Hello, web!");
});

app.get("/projects", (req, res) => {
  const tag = req.query.tag;
  console.log(tag);

  const filteredProjects = projects.filter((project) => project.tag === tag);

  const sort = req.query.sort;
  console.log(sort);
  if (sort === "asc") {
    filteredProjects.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort === "desc") {
    filteredProjects.sort((a, b) => b.name.localeCompare(a.name));
  }

  res.json(filteredProjects);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
