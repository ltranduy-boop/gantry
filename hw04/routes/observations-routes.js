import { Router } from "express";
import * as Controller from "../controllers/observations-controller.js";

const router = Router();
router.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
  next();
});
const asyncHandler = Controller.asyncHandler;
router.post("/", asyncHandler(Controller.Create));
router.get("/", asyncHandler(Controller.Read));
router.put("/:id", asyncHandler(Controller.Update));
router.delete("/:id", asyncHandler(Controller.Delete));

export default router;
