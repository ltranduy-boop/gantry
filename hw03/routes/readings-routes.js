import { Router } from "express";
import * as Controller from "../controllers/readings-controller.js";

const router = Router();
router.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
  next();
});
const asyncHandler = Controller.asyncHandler;
router.get("/", asyncHandler(Controller.showReadings));
router.post("/", asyncHandler(Controller.addReading));
router.put("/:id", asyncHandler(Controller.updateReading));
router.delete("/:id", asyncHandler(Controller.deleteReading));

export default router;
