/**
 * whatsappBot.js
 * Interactive Button & Menu-based WhatsApp Chatbot engine for MannJyotish.
 * Supports:
 * - Meta WhatsApp Business Cloud API (Interactive Buttons & List Menus)
 * - Automatic fallback for plain text & Baileys
 */

const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN || process.env.WHATSAPP_CLOUD_API_KEY || '';
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || '';

/**
 * Sends a WhatsApp message (Text or Interactive) via Meta Cloud API
 */
async function sendWhatsAppMessage(to, messageContent) {
  if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID) {
    console.log(`[WhatsApp Bot Simulation] Sending to ${to}:`, JSON.stringify(messageContent, null, 2));
    return { success: true, simulated: true };
  }

  try {
    const url = `https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`;
    
    // Check if messageContent is already a formatted interactive/custom payload or plain text
    let payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: to,
    };

    if (typeof messageContent === 'string') {
      payload.type = 'text';
      payload.text = { preview_url: true, body: messageContent };
    } else if (messageContent && messageContent.type === 'interactive') {
      payload.type = 'interactive';
      payload.interactive = messageContent.interactive;
    } else {
      payload.type = 'text';
      payload.text = { preview_url: true, body: String(messageContent) };
    }

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!res.ok) {
      console.error('Meta WhatsApp API send error:', data);
      return { success: false, error: data };
    }
    console.log(`[WhatsApp Bot] Successfully sent interactive message to ${to}`);
    return { success: true, data };
  } catch (err) {
    console.error('WhatsApp Bot network error:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Generates an Interactive List Menu payload (Meta WhatsApp Cloud API)
 */
function getInteractiveMainMenu(senderName) {
  const greeting = senderName ? `Namaste *${senderName}*! ` : `Namaste! `;
  return {
    type: 'interactive',
    interactive: {
      type: 'list',
      header: {
        type: 'text',
        text: '🕉️ MannJyotish Vedic Services'
      },
      body: {
        text: `${greeting}Welcome to *MannJyotish*, Institute of Vedic Sciences & Astrology, guided by *Acharya Shri Hit Ashay Krishn Goswami* (18th Gen Radhavallabh Tradition, Vrindavan).\n\nPlease tap the button below to explore our offerings or ask your urgent question:`
      },
      footer: {
        text: 'Tap below to choose a service'
      },
      action: {
        button: 'Select Service ▾',
        sections: [
          {
            title: '✨ Special Guidance & Readings',
            rows: [
              {
                id: 'opt_first_question',
                title: 'Ask 1st Question (₹99)',
                description: 'Direct answer & Kundli check from Acharya Ji'
              },
              {
                id: 'opt_consultations',
                title: 'Personal Consultations',
                description: 'Kundli (₹2,100), Palmistry, Career, Vastu'
              },
              {
                id: 'opt_pujas',
                title: 'Sacred Online Pujas',
                description: 'Navagraha Shanti, Rudrabhishek & Havans'
              }
            ]
          },
          {
            title: '🎓 Academy & Free Tools',
            rows: [
              {
                id: 'opt_demo_class',
                title: 'Free Live Demo Class',
                description: '1st of next month at 7:00 PM IST'
              },
              {
                id: 'opt_free_kundli',
                title: 'Free Kundli & 36 Guna',
                description: 'Accurate Swiss Ephemeris calculations'
              },
              {
                id: 'opt_contact_acharya',
                title: 'Direct Call / Message',
                description: 'Connect with Acharya Ji (+91 70007 42315)'
              }
            ]
          }
        ]
      }
    }
  };
}

/**
 * Generates an Interactive 3-Button Reply payload
 */
function getInteractiveButtonReply(bodyText, buttons) {
  return {
    type: 'interactive',
    interactive: {
      type: 'button',
      body: {
        text: bodyText
      },
      action: {
        buttons: buttons.map(b => ({
          type: 'reply',
          reply: {
            id: b.id,
            title: b.title.slice(0, 20) // WhatsApp limit: 20 chars
          }
        }))
      }
    }
  };
}

/**
 * Generates response based on button ID, list selection, or typed text
 * Returns either an interactive payload (for Meta API) or text.
 */
function handleIncomingWhatsAppInteraction(userMessage, fromNumber, senderName) {
  const clean = (userMessage || '').trim().toLowerCase();

  // 1. First Question (₹99)
  if (clean === 'opt_first_question' || clean === '1' || clean.includes('first question') || clean.includes('99')) {
    const text = 
      `🕉️ *Ask Your First Question (Special ₹99 Offer)*\n\n` +
      `Get authentic, personal Vedic clarity directly from *Acharya Shri Hit Ashay Krishn Goswami* on your urgent concern.\n\n` +
      `*Please reply with your birth details:*\n` +
      `1️⃣ *Full Name:*\n` +
      `2️⃣ *Date of Birth (DD/MM/YYYY):*\n` +
      `3️⃣ *Time of Birth (AM/PM):*\n` +
      `4️⃣ *Place of Birth (City, State):*\n` +
      `5️⃣ *Your Question:* (Career, Marriage, Health, Kundli Dosha)\n\n` +
      `_Introductory dakshina: ₹99 only. Once received, Acharya Ji will analyze your Kundli chart and respond right here!_`;

    return getInteractiveButtonReply(text, [
      { id: 'opt_consultations', title: '🔯 Consultations' },
      { id: 'opt_demo_class', title: '🎓 Free Demo Class' },
      { id: 'opt_main_menu', title: '📋 Main Menu' }
    ]);
  }

  // 2. Personal Consultations
  if (clean === 'opt_consultations' || clean === '2' || clean.includes('consultation') || clean.includes('book')) {
    const text = 
      `🔯 *Personal Vedic Consultations with Acharya Ji*\n\n` +
      `• *Kundli Reading & Life Analysis* — ₹2,100\n` +
      `  _Deep analysis of 12 houses, Dashas & planetary transits_\n` +
      `• *Palmistry (Hast Rekha)* — ₹1,500\n` +
      `  _Hand line reading for destiny, health & milestones_\n` +
      `• *Career & Business Guidance* — ₹2,500\n` +
      `• *Marriage Match (36 Guna Milan)* — ₹3,100\n` +
      `• *Vastu Shastra Consultation* — ₹5,000\n\n` +
      `🌐 *Book online instantly:* https://mannjyotish.com`;

    return getInteractiveButtonReply(text, [
      { id: 'opt_first_question', title: '✨ Ask ₹99 Question' },
      { id: 'opt_pujas', title: '🪔 Sacred Pujas' },
      { id: 'opt_main_menu', title: '📋 Main Menu' }
    ]);
  }

  // 3. Online Pujas
  if (clean === 'opt_pujas' || clean === '3' || clean.includes('puja') || clean.includes('pooja')) {
    const text = 
      `🪔 *Sacred Online Pujas & Havans*\n` +
      `_Performed in Vrindavan Dham by Vedic Pandits with authentic Vidhi-Vidhan._\n\n` +
      `• *Navagraha Shanti Puja* (All 9 planets balance) — ₹31,000\n` +
      `• *Navagraha Homa / Sacred Fire Ritual* — ₹11,000\n` +
      `• *Rudrabhishek Puja* (Lord Shiva blessings) — ₹11,000\n` +
      `• *Mangal Dosha Shanti* — ₹21,000\n` +
      `• *Kaal Sarp Dosha Shanti* — ₹21,000\n` +
      `• *Maha Mrityunjaya Japa & Homa* — ₹1,00,000\n\n` +
      `📦 _Includes live sankalpa video and energized Prasad delivered to your doorstep._\n` +
      `🌐 *View all 18+ Pujas:* https://mannjyotish.com`;

    return getInteractiveButtonReply(text, [
      { id: 'opt_first_question', title: '✨ Ask ₹99 Question' },
      { id: 'opt_consultations', title: '🔯 Consultations' },
      { id: 'opt_main_menu', title: '📋 Main Menu' }
    ]);
  }

  // 4. Academy & Demo Class
  if (clean === 'opt_demo_class' || clean === '4' || clean.includes('course') || clean.includes('academy') || clean.includes('demo')) {
    const text = 
      `🎓 *MannJyotish Academy of Vedic Sciences*\n` +
      `_Learn authentic Vedic Astrology directly under Acharya Ji's mentorship._\n\n` +
      `📚 *Courses Available:*\n` +
      `1. *Foundation of Jyotish* (Rashis, Bhavas, Planets)\n` +
      `2. *Advanced Chart Reading* (Dashas, Nakshatras & Predictions)\n` +
      `3. *The Art of Tarot & Vedic Fusion*\n\n` +
      `🗓️ *Free Live Demo Class:*\n` +
      `Held on the *1st of every month at 7:00 PM IST* on Google Meet/Zoom!\n` +
      `📜 *Official Course Certificate provided upon completion.*\n\n` +
      `🌐 *Register free:* https://mannjyotish.com`;

    return getInteractiveButtonReply(text, [
      { id: 'opt_first_question', title: '✨ Ask ₹99 Question' },
      { id: 'opt_contact_acharya', title: '📞 Talk to Acharya' },
      { id: 'opt_main_menu', title: '📋 Main Menu' }
    ]);
  }

  // 5. Free Kundli Tools
  if (clean === 'opt_free_kundli' || clean === '5' || clean.includes('kundli') || clean.includes('free') || clean.includes('match')) {
    const text = 
      `✨ *Free Vedic Astrology Tools*\n\n` +
      `Access high-precision Swiss Ephemeris calculations on our portal:\n\n` +
      `• 🔯 *Free Janam Kundli:* https://mannjyotish.com\n` +
      `• 🌙 *Moon Sign (Chandra Rashi) Calculator:* https://mannjyotish.com\n` +
      `• 💍 *36 Guna Milan (Kundli Matching):* https://mannjyotish.com\n` +
      `• 📅 *Daily Vedic Panchang:* https://mannjyotish.com`;

    return getInteractiveButtonReply(text, [
      { id: 'opt_first_question', title: '✨ Ask ₹99 Question' },
      { id: 'opt_demo_class', title: '🎓 Free Demo Class' },
      { id: 'opt_main_menu', title: '📋 Main Menu' }
    ]);
  }

  // 6. Direct Contact
  if (clean === 'opt_contact_acharya' || clean === '6' || clean.includes('contact') || clean.includes('acharya') || clean.includes('ashay')) {
    const text = 
      `🙏 *Connect with Acharya Shri Hit Ashay Krishn Goswami*\n\n` +
      `Your request has been forwarded to Acharya Ji's personal desk. Please write your question or message, and we will reply as soon as possible.\n\n` +
      `📞 *Direct Phone:* +91 70007 42315\n` +
      `📧 *Email:* contact@mannjyotish.com\n` +
      `🌐 *Website:* https://mannjyotish.com\n` +
      `📍 *Vrindavan Dham & Bhind (MP)*`;

    return getInteractiveButtonReply(text, [
      { id: 'opt_first_question', title: '✨ Ask ₹99 Question' },
      { id: 'opt_consultations', title: '🔯 Consultations' },
      { id: 'opt_main_menu', title: '📋 Main Menu' }
    ]);
  }

  // Default: Interactive List Menu
  return getInteractiveMainMenu(senderName);
}

/**
 * Plain Text fallback for clients (or Baileys)
 */
function handleIncomingWhatsAppText(userMessage, fromNumber, senderName) {
  const result = handleIncomingWhatsAppInteraction(userMessage, fromNumber, senderName);
  
  if (typeof result === 'string') return result;

  if (result.type === 'interactive') {
    if (result.interactive.type === 'button') {
      const body = result.interactive.body.text;
      const btns = result.interactive.action.buttons.map((b, i) => `${i + 1}️⃣ *${b.reply.title}*`).join('\n');
      return `${body}\n\n*Quick Options:*\n${btns}\n\n_Reply with 1, 2, or 3._`;
    }
    if (result.interactive.type === 'list') {
      const body = result.interactive.body.text;
      const rows = result.interactive.action.sections.flatMap(s => s.rows);
      const listText = rows.map((r, i) => `${i + 1}️⃣ *${r.title}* — ${r.description}`).join('\n\n');
      return `${body}\n\n${listText}\n\n_Reply with 1 to 6 to select._`;
    }
  }

  return 'Namaste! Welcome to MannJyotish. Reply with MENU to see our services.';
}

module.exports = {
  sendWhatsAppMessage,
  handleIncomingWhatsAppInteraction,
  handleIncomingWhatsAppText,
  getInteractiveMainMenu,
  getInteractiveButtonReply
};
