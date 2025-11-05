import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const verifyWebhook = (req, res) => {
  const verify_token = process.env.WHATSAPP_VERIFY_TOKEN;
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token && mode === "subscribe" && token === verify_token) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
};

export const receiveMessage = (req, res) => {
  console.log("📩 Incoming message:", JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
};

export const sendMessage = async (req, res) => {
  const { phone, message } = req.body;

  try {
    const response = await axios.post(
      `https://graph.facebook.com/v17.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: phone,
        type: "text",
        text: { body: message },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
    res.json({ success: true, data: response.data });
  } catch (error) {
    res.status(500).json({ error: error.response?.data || error.message });
  }
};
