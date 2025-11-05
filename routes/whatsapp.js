import express from "express";
import { verifyWebhook, receiveMessage, sendMessage } from "../controllers/whatsappController.js";

const router = express.Router();

router.get("/webhook", verifyWebhook);
router.post("/webhook", receiveMessage);
router.post("/send", sendMessage);

export default router;
