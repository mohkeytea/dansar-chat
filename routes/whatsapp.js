import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.post("/send", async (req, res) => {
  try {
    const { message, recipient } = req.body;
    const TOKEN = process.env.WHATSAPP_TOKEN;
    const PHONE_ID = process.env.WHATSAPP_PHONE_ID;
    const target = recipient || process.env.DEFAULT_TARGET_NUMBER;

    if (!TOKEN || !PHONE_ID) {
      return res.status(500).json({ error: "Missing WhatsApp API credentials" });
    }

    if (!message) {
      return res.status(400).json({ error: "Message body required" });
    }

    const payload = {
      messaging_product: "whatsapp",
      to: target,
      type: "text",
      text: { body: message },
    };

    const response = await fetch(`https://graph.facebook.com/v20.0/${PHONE_ID}/messages`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Meta API Error:", data);
      return res.status(500).json({ error: data });
    }

    return res.json({ success: true, data });
  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
