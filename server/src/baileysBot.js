/**
 * baileysBot.js
 * Standalone direct WhatsApp Bot using @whiskeysockets/baileys.
 * Supports:
 * - Native Interactive Flow Buttons (Quick Reply, CTA URL, CTA Call)
 * - Interactive MannJyotish menu
 * - Chit Fund automated payment reminder engine
 */

const { 
  default: makeWASocket, 
  useMultiFileAuthState, 
  DisconnectReason, 
  fetchLatestBaileysVersion, 
  generateWAMessageFromContent 
} = require('@whiskeysockets/baileys');
const pino = require('pino');
const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');
const { handleChitFundIncoming } = require('./chitFundReminder');

let sock = null;
let currentQR = null;
let currentQRRaw = null;
let botStatus = 'disconnected';
let connectedUser = null;

const AUTH_DIR = path.join(__dirname, '../baileys_auth');

/**
 * Sends Native Interactive Buttons via Baileys Native Flow
 */
async function sendBaileysButtons(targetSock, jid, { title, body, footer, buttons }) {
  if (!targetSock) throw new Error('WhatsApp client is not connected.');

  try {
    const formattedButtons = buttons.map(b => {
      if (b.type === 'url') {
        return {
          name: 'cta_url',
          buttonParamsJson: JSON.stringify({ display_text: b.title, url: b.url })
        };
      } else if (b.type === 'call') {
        return {
          name: 'cta_call',
          buttonParamsJson: JSON.stringify({ display_text: b.title, phone_number: b.phone })
        };
      } else {
        return {
          name: 'quick_reply',
          buttonParamsJson: JSON.stringify({ display_text: b.title, id: b.id })
        };
      }
    });

    const msg = generateWAMessageFromContent(
      jid,
      {
        viewOnceMessage: {
          message: {
            interactiveMessage: {
              body: { text: body },
              footer: { text: footer || '' },
              header: title ? { title: title, hasMediaAttachment: false } : undefined,
              nativeFlowMessage: {
                buttons: formattedButtons
              }
            }
          }
        }
      },
      { userJid: targetSock.user.id }
    );

    await targetSock.relayMessage(jid, msg.message, { messageId: msg.key.id });
    console.log(`[Baileys Buttons] Successfully relayed native flow buttons to ${jid}`);
    return { success: true, native: true };
  } catch (err) {
    console.warn(`[Baileys Buttons Warning] Native flow button relay: ${err.message}. Falling back to formatted text.`);
    const btnText = buttons.map((b, i) => `${i + 1}️⃣ *${b.title}*`).join('\n');
    await targetSock.sendMessage(jid, { text: `${body}\n\n*Options:*\n${btnText}\n\n_Reply with 1, 2, or 3._` });
    return { success: true, native: false };
  }
}

async function startBaileysBot() {
  try {
    if (!fs.existsSync(AUTH_DIR)) {
      fs.mkdirSync(AUTH_DIR, { recursive: true });
    }

    botStatus = 'connecting';
    const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);
    const { version, isLatest } = await fetchLatestBaileysVersion();
    console.log(`[Baileys] Starting WhatsApp client with version v${version.join('.')}, isLatest: ${isLatest}`);

    sock = makeWASocket({
      version,
      logger: pino({ level: 'error' }),
      auth: state,
      printQRInTerminal: true,
      browser: ['MannJyotish Bot', 'Chrome', '1.0.0'],
      syncFullHistory: false
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        currentQRRaw = qr;
        try {
          currentQR = await QRCode.toDataURL(qr, { margin: 2, scale: 8 });
        } catch (e) {
          console.error('Failed to generate QR DataURL:', e);
        }
        botStatus = 'qr_ready';
        console.log('[Baileys] New QR code generated. Scan via web at /api/whatsapp/scan or terminal.');
      }

      if (connection === 'close') {
        const statusCode = lastDisconnect?.error?.output?.statusCode;
        const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
        console.log(`[Baileys] Connection closed due to: ${lastDisconnect?.error?.message || 'Unknown'}, shouldReconnect: ${shouldReconnect}`);

        botStatus = 'disconnected';
        connectedUser = null;
        currentQR = null;

        if (statusCode === DisconnectReason.loggedOut) {
          console.log('[Baileys] Device logged out. Clearing auth credentials...');
          try {
            fs.rmSync(AUTH_DIR, { recursive: true, force: true });
          } catch (e) {}
          setTimeout(startBaileysBot, 3000);
        } else if (shouldReconnect) {
          console.log('[Baileys] Reconnecting in 5 seconds...');
          setTimeout(startBaileysBot, 5000);
        }
      } else if (connection === 'open') {
        botStatus = 'connected';
        currentQR = null;
        currentQRRaw = null;
        connectedUser = sock.user;
        console.log('╔══════════════════════════════════════════════════════╗');
        console.log('║  ✓ WhatsApp Bot is CONNECTED & LIVE!                 ║');
        console.log(`║  Account: ${sock.user?.name || 'Linked'} (${sock.user?.id || ''}) ║`);
        console.log('╚══════════════════════════════════════════════════════╝');
      }
    });

    // Handle Incoming Messages
    sock.ev.on('messages.upsert', async ({ messages, type }) => {
      try {
        if (!messages || !messages.length) return;

        for (const m of messages) {
          if (!m.message || m.key.fromMe) continue;
          if (m.key.remoteJid === 'status@broadcast') continue;
          if (m.key.remoteJid.endsWith('@g.us')) continue; // direct chats only

          // Extract message text from text, buttons, or native flow responses
          let userText = 
            m.message.conversation ||
            m.message.extendedTextMessage?.text ||
            m.message.imageMessage?.caption ||
            m.message.buttonsResponseMessage?.selectedButtonId ||
            m.message.templateButtonReplyMessage?.selectedId ||
            '';

          if (!userText && m.message.interactiveResponseMessage?.nativeFlowResponseMessage?.paramsJson) {
            try {
              const params = JSON.parse(m.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson);
              userText = params.id || '';
            } catch (e) {}
          }

          if (!userText || !userText.trim()) continue;

          const from = m.key.remoteJid;
          const senderName = m.pushName || '';

          console.log(`[Baileys Message] From: ${from} (${senderName}): "${userText}"`);

          // DMR Chit Fund bot response
          const botReply = handleChitFundIncoming(userText, from, senderName);
          await sock.sendMessage(from, { text: botReply });
          console.log(`[Baileys ChitFund] Replied with Chit Fund menu/response to ${from}`);

          console.log(`[Baileys Sent] Successfully replied to ${from}`);
        }
      } catch (err) {
        console.error('[Baileys Message Handler Error]:', err);
      }
    });

  } catch (err) {
    console.error('[Baileys Init Error]:', err);
    botStatus = 'disconnected';
    setTimeout(startBaileysBot, 10000);
  }
}

function getBotState() {
  return {
    status: botStatus,
    qr: currentQR,
    user: connectedUser ? {
      id: connectedUser.id,
      name: connectedUser.name || connectedUser.notify || 'WhatsApp Bot'
    } : null
  };
}

function getSocket() {
  return sock;
}

async function logoutBot() {
  try {
    if (sock) {
      await sock.logout();
    }
  } catch (e) {}
  try {
    fs.rmSync(AUTH_DIR, { recursive: true, force: true });
  } catch (e) {}
  botStatus = 'disconnected';
  connectedUser = null;
  currentQR = null;
  setTimeout(startBaileysBot, 2000);
  return { success: true };
}

module.exports = {
  startBaileysBot,
  getBotState,
  getSocket,
  sendBaileysButtons,
  logoutBot
};
