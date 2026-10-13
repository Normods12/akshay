/**
 * WhatsApp Meta Cloud API helper for akshay-client (mannjyotish.com)
 */

const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const WHATSAPP_API_VERSION = process.env.WHATSAPP_API_VERSION || "v21.0";

async function sendWhatsApp({ to, body }) {
  const cleanTo = (to || "").replace(/\D/g, "");

  if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) {
    console.log("[whatsapp:stub]", { to: cleanTo, body });
    return { ok: true };
  }

  try {
    const url = `https://graph.facebook.com/${WHATSAPP_API_VERSION}/${WHATSAPP_PHONE_NUMBER_ID}/messages`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: cleanTo,
        type: "text",
        text: { body },
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.warn("[whatsapp:error]", response.status, data);
      return { ok: false, error: data };
    }

    return { ok: true, data };
  } catch (err) {
    console.error("[whatsapp:exception]", err);
    return { ok: false, error: err.message };
  }
}

module.exports = { sendWhatsApp };
