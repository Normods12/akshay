/**
 * sendChitReminders.js
 * CLI / Service script to trigger WhatsApp reminders for DMR Chit Fund subscribers.
 */

const path = require('path');
const { parseChitFundData, buildReminderMessage } = require('./chitFundReminder');
const { getSocket } = require('./baileysBot');

async function sendReminders(limit = 2) {
  const filePath = path.join(__dirname, '../data/DMR_ChitFund_Bot_Sample.xlsx');
  const { config, subscribers } = parseChitFundData(filePath);

  const sock = getSocket();
  if (!sock) {
    throw new Error('WhatsApp bot is not connected. Please ensure Baileys is active and linked.');
  }

  const targets = subscribers.slice(0, limit);
  console.log(`[ChitFund] Found ${subscribers.length} total subscribers. Triggering reminders for first ${targets.length}...`);

  const results = [];

  for (const sub of targets) {
    const jid = `${sub.phone}@s.whatsapp.net`;
    const { text } = buildReminderMessage(sub, config);

    console.log(`[ChitFund Sending] -> ${sub.name} (${sub.phone}) | Due: ₹${sub.amount.toLocaleString('en-IN')}`);

    try {
      // Send direct prominent text message (guaranteed delivery & notification)
      const res = await sock.sendMessage(jid, { text });

      results.push({
        subscriber: sub.name,
        phone: sub.phone,
        tNo: sub.tNo,
        amount: sub.amount,
        dueDate: sub.dueDate,
        daysRemaining: sub.daysRemaining,
        status: 'Sent',
        messageId: res?.key?.id,
        timestamp: new Date().toISOString()
      });

      console.log(`✓ [ChitFund Sent] Successfully delivered reminder to ${sub.phone} (MsgID: ${res?.key?.id})`);
    } catch (err) {
      console.error(`✗ [ChitFund Error] Failed to send to ${sub.phone}:`, err);
      results.push({
        subscriber: sub.name,
        phone: sub.phone,
        tNo: sub.tNo,
        status: 'Failed',
        error: err.message
      });
    }

    // Rate limit throttle: 2 seconds between messages
    await new Promise(r => setTimeout(r, 2000));
  }

  return results;
}

module.exports = {
  sendReminders
};
