import express from "express";
import entriesRouter from "./routes/entries.js";
import mongoose from "mongoose";
import morgan from "morgan";

await mongoose.connect(
  process.env.MONGODB_URI ||
    "mongodb://dev:devpassword@mongo:27017/devdb?authSource=admin",
);

const app = express();
const PORT = 3000;

const aboutMe = {
  name: "Tran Duy Long",
  age: 20,
  identity: "Helicopter",
};
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
app.use(morgan("dev"));
app.set("view engine", "ejs");
app.set("views", "views");
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use("/entries", entriesRouter);
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use((req, res) => {
  res.status(404).send("Page not found.");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
