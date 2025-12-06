import { Router } from "express";
import TaskController from "../controllers/task.controller.js";

const router = Router();

router.get("/", TaskController.list);
router.post("/", TaskController.create);
router.post("/parse-voice",TaskController.parseVoice)
router.get("/:id", TaskController.getOne);
router.patch("/:id/status", TaskController.updateStatus);
router.put("/:id", TaskController.update);
router.delete("/:id", TaskController.delete);

export default router;
