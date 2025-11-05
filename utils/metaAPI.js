import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

/**
 * Meta (WhatsApp) API Helper
 * Central place to handle WhatsApp API requests.
 */

const META_API_URL = `https://graph.facebook.com/v17.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

/**
 * Send a WhatsApp text message
 * @param {string} to - Recipient's phone number in international format (e.g., "2547XXXXXXXX")
 * @param {string} message - Message text
 * @returns {Promise<object>} WhatsApp API response
 */
export async function sendWhatsAppMessage(to, message) {
  try {
    const response = await axios.post(
      META_API_URL,
      {
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body: message },
      },
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ WhatsApp message sent:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Failed to send WhatsApp message:", error.response?.data || error.message);
    throw error;
  }
}

/**
 * Verify webhook subscription (GET /webhook)
 * @param {object} query - Request query parameters
 * @returns {object|number} Challenge or status
 */
export function verifyWebhook(query) {
  const mode = query["hub.mode"];
  const token = query["hub.verify_token"];
  const challenge = query["hub.challenge"];

  if (mode && token && mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    console.log("✅ Webhook verified successfully!");
    return challenge;
  } else {
    console.warn("❌ Webhook verification failed!");
    return 403;
  }
}

/**
 * Handle webhook events (POST /webhook)
 * @param {object} body - Incoming request body
 */
export function handleWebhookEvent(body) {
  if (!body.object) return;

  body.entry?.forEach((entry) => {
    entry.changes?.forEach((change) => {
      const value = change.value;
      if (value && value.messages) {
        value.messages.forEach((msg) => {
          const from = msg.from;
          const text = msg.text?.body;
          console.log(`💬 Message from ${from}: ${text}`);
        });
      }
    });
  });
}
