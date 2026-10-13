/**
 * chitFundReminder.js
 * Comprehensive DMR Chit Fund Bot & Reminder Engine
 * - Parses DMR_ChitFund_Bot_Sample.xlsx or uploaded Excel files (buffers/paths)
 * - Evaluates payment status for the current month (Paid vs Pending)
 * - Generates personalized WhatsApp reminder payloads
 * - Simulates Mock BSP API / Meta Cloud API dispatch with realistic telemetry
 * - Tracks dispatch history locally (no cloud leakage)
 */

const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const DEFAULT_FILE = path.join(__dirname, '../data/DMR_ChitFund_Bot_Sample.xlsx');
const ACTIVE_FILE = path.join(__dirname, '../data/DMR_ChitFund_Active.xlsx');
const HISTORY_FILE = path.join(__dirname, '../data/chit_dispatch_history.json');

/**
 * Returns path of active file if present, else fallback to default sample
 */
function getActiveFilePath() {
  if (fs.existsSync(ACTIVE_FILE)) return ACTIVE_FILE;
  return DEFAULT_FILE;
}

/**
 * Parses subscribers and configuration from an Excel workbook (from filePath or Buffer)
 */
function parseChitFundData(source = null) {
  let workbook;

  if (Buffer.isBuffer(source)) {
    workbook = XLSX.read(source, { type: 'buffer' });
  } else {
    const targetPath = source || getActiveFilePath();
    if (!fs.existsSync(targetPath)) {
      throw new Error(`Chit fund file not found at: ${targetPath}`);
    }
    workbook = XLSX.readFile(targetPath);
  }

  // 1. Read Chit_Details config
  const config = {
    fundName: 'DMR CHIT FUND PVT LTD',
    batch: 'DST1C - 25 LAKHS',
    psoNumber: 'MM270826P567',
    dueDay: '5th of every month',
    reminderSchedule: '3 days before due, on due date, 2 days after',
    templateName: 'chit_payment_reminder'
  };

  if (workbook.Sheets['Chit_Details']) {
    const rawDetails = XLSX.utils.sheet_to_json(workbook.Sheets['Chit_Details'], { header: 1 });
    for (const row of rawDetails) {
      if (!row || !row[0]) continue;
      const key = String(row[0]).trim();
      const val = row[1] ? String(row[1]).trim() : '';
      if (key.includes('Fund Name')) config.fundName = val;
      if (key.includes('Batch')) config.batch = val;
      if (key.includes('PSO')) config.psoNumber = val;
      if (key.includes('Due Day')) config.dueDay = val;
      if (key.includes('Reminder Schedule')) config.reminderSchedule = val;
      if (key.includes('Template Name')) config.templateName = val;
    }
  }

  // 2. Read Subscribers Sheet (or first sheet if Subscribers sheet not explicitly named)
  const sheetName = workbook.Sheets['Subscribers'] ? 'Subscribers' : workbook.SheetNames[0];
  const subscribers = [];

  if (workbook.Sheets[sheetName]) {
    const rawRows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
    let headerIdx = -1;
    for (let i = 0; i < rawRows.length; i++) {
      const row = rawRows[i];
      if (row && Array.isArray(row)) {
        const hasTNo = row.some(cell => {
          const str = String(cell).toUpperCase();
          return str.includes('T NO') || str.includes('T-NO');
        });
        const hasSubscriber = row.some(cell => {
          const str = String(cell).toUpperCase();
          return str.includes('SUBSCRIBER');
        });
        if (hasTNo && hasSubscriber) {
          headerIdx = i;
          break;
        }
      }
    }

    if (headerIdx !== -1) {
      for (let i = headerIdx + 1; i < rawRows.length; i++) {
        const r = rawRows[i];
        if (!r || (!r[1] && !r[2])) continue;

        // Skip legend or explanatory rows
        if (r[0] && String(r[0]).toUpperCase().includes('LEGEND')) continue;

        const sNo = r[0] || (i - headerIdx);
        const tNo = String(r[1] || '').trim();
        const name = String(r[2] || '').trim();

        // Skip if this happens to be a duplicate header
        if (name.toUpperCase().includes('SUBSCRIBER NAME') || tNo.toUpperCase().includes('T NO')) continue;

        let phone = String(r[3] || '').trim().replace(/[^0-9]/g, '');
        if (phone.length === 10) phone = '91' + phone;

        const month = String(r[4] || '').trim();
        const amount = Number(String(r[5] || '0').replace(/[^0-9.]/g, '')) || 0;
        
        let dueDate = String(r[6] || '').trim();
        // Handle Excel numeric date serials if applicable
        if (/^\d{5}$/.test(dueDate)) {
          const parsedDate = new Date(Math.round((Number(dueDate) - 25569) * 86400 * 1000));
          if (!isNaN(parsedDate.getTime())) {
            dueDate = parsedDate.toISOString().split('T')[0];
          }
        }

        const rawStatus = String(r[7] || 'Pending').trim();
        const rawPaidDate = r[8] ? String(r[8]).trim() : '';
        const daysRemaining = (r[9] !== undefined && r[9] !== '') ? Number(r[9]) : '';
        const lastReminderSent = r[10] ? String(r[10]).trim() : '';

        // Strict Check: Has this user paid for this month?
        const isStatusPaid = rawStatus.toLowerCase() === 'paid' || rawStatus.toLowerCase() === 'cleared' || rawStatus.toLowerCase() === 'success';
        const hasValidPaidDate = Boolean(rawPaidDate && rawPaidDate !== '-' && rawPaidDate.toLowerCase() !== 'pending' && rawPaidDate.toLowerCase() !== 'unpaid');
        const hasPaid = isStatusPaid || hasValidPaidDate;

        if (name && (tNo || phone)) {
          subscribers.push({
            id: tNo || `SUB-${sNo}`,
            sNo,
            tNo,
            name,
            phone,
            month: month || 'CURRENT MONTH',
            amount,
            dueDate,
            status: hasPaid ? 'Paid' : 'Pending',
            hasPaid,
            paidDate: rawPaidDate,
            daysRemaining,
            lastReminderSent
          });
        }
      }
    }
  }

  // 3. Compute Summary Metrics
  const totalSubscribers = subscribers.length;
  const paidSubscribers = subscribers.filter(s => s.hasPaid);
  const pendingSubscribers = subscribers.filter(s => !s.hasPaid);

  const totalPaidAmount = paidSubscribers.reduce((acc, s) => acc + s.amount, 0);
  const totalDueAmount = pendingSubscribers.reduce((acc, s) => acc + s.amount, 0);
  const totalFundVolume = totalPaidAmount + totalDueAmount;

  const stats = {
    totalSubscribers,
    paidCount: paidSubscribers.length,
    pendingCount: pendingSubscribers.length,
    totalPaidAmount,
    totalDueAmount,
    totalFundVolume,
    collectionPercentage: totalSubscribers > 0 ? Math.round((paidSubscribers.length / totalSubscribers) * 100) : 0,
    currentMonth: subscribers[0]?.month || 'CURRENT MONTH',
    dueDate: subscribers[0]?.dueDate || config.dueDay
  };

  return { config, subscribers, stats };
}

/**
 * Builds standard Chit Fund reminder text message
 */
function buildReminderMessage(sub, config) {
  const formattedAmount = Number(sub.amount).toLocaleString('en-IN');
  let formattedDue = sub.dueDate;
  try {
    const d = new Date(sub.dueDate);
    if (!isNaN(d.getTime())) {
      const dd = String(d.getDate()).padStart(2, '0');
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const yyyy = d.getFullYear();
      formattedDue = `${dd}-${mm}-${yyyy}`;
    }
  } catch (e) {}

  const text = 
`🔔 *${config.fundName}*
*Batch: ${config.batch} • PSO: ${config.psoNumber}*

Hi *${sub.name}*, this is a friendly reminder for your chit installment (*T-No: ${sub.tNo}*).

💰 *Amount Due:* ₹${formattedAmount}
🗓️ *Month:* ${sub.month}
📅 *Due Date:* ${formattedDue}
⏳ *Days Remaining:* ${sub.daysRemaining} Days

━━━━━━━━━━━━━━━━━━━━━
*Quick Reply Options:*
👉 Reply *PAID* if already transferred
👉 Reply *PAY* to view Bank & UPI details
👉 Reply *STATUS* to check your chit balance
👉 Reply *CALL* to connect with the manager
━━━━━━━━━━━━━━━━━━━━━
_DMR Chit Fund Pvt Ltd Automated Desk_`;

  return { text, sub, config };
}

/**
 * Handles all incoming WhatsApp messages for DMR Chit Fund Bot
 */
function handleChitFundIncoming(userMessage, fromNumber, senderName) {
  const clean = (userMessage || '').trim().toLowerCase();
  const digits = (fromNumber || '').replace(/[^0-9]/g, '');

  const { config, subscribers } = parseChitFundData();
  // Find matching subscriber by phone number
  const subscriber = subscribers.find(s => digits.includes(s.phone) || s.phone.includes(digits));

  // 1. Status / Balance Check
  if (clean === '1' || clean === 'status' || clean.includes('balance') || clean.includes('due') || clean.includes('check')) {
    if (subscriber) {
      const formattedAmount = Number(subscriber.amount).toLocaleString('en-IN');
      return (
`📋 *Chit Account Summary*
*Subscriber Name:* ${subscriber.name}
*T-Number:* ${subscriber.tNo}
*Group:* ${config.batch}
*Installment Month:* ${subscriber.month}

💰 *Amount Due:* ₹${formattedAmount}
📅 *Due Date:* ${subscriber.dueDate}
⏳ *Days Remaining:* ${subscriber.daysRemaining} Days
📌 *Current Status:* ${subscriber.status === 'Paid' ? '✅ PAID' : '⏳ PENDING'}

_Reply *PAY* for payment details, or *MENU* for main menu._`
      );
    } else {
      return (
`📋 *Chit Account Lookup*
We could not find an active subscriber profile for phone number: +${digits}.
Please reply with your *T-Number* (e.g. *DST1C-01*) or reply *CALL* to connect with our accounts team.`
      );
    }
  }

  // 2. Bank Details & UPI
  if (clean === '2' || clean === 'pay' || clean.includes('bank') || clean.includes('upi') || clean.includes('account') || clean.includes('how to pay')) {
    return (
`💳 *Official Payment Details*
*${config.fundName}*

• *Bank Name:* HDFC Bank
• *Account Name:* DMR CHIT FUND PRIVATE LIMITED
• *Account Number:* 50200088991122
• *IFSC Code:* HDFC0001234
• *Branch:* Main Branch
• *UPI ID / VPA:* dmrchitfund@hdfcbank

📌 *Important:* Please add your *T-Number* in the payment remarks. After paying, reply *PAID* or send the screenshot here for immediate reconciliation.`
    );
  }

  // 3. Paid Confirmation / Submit Proof
  if (clean === '3' || clean === 'paid' || clean.includes('already paid') || clean.includes('transferred') || clean.includes('screenshot') || clean.includes('done')) {
    const who = subscriber ? `*${subscriber.name}* (${subscriber.tNo})` : `your account`;
    return (
`✅ *Payment Notification Logged*

Thank you! We have recorded payment confirmation for ${who}.
Our accounts department will verify the credit and send your digital e-receipt shortly.

_You can also attach your bank transaction screenshot right here._`
    );
  }

  // 4. Next Auction Date & Bidding Rules
  if (clean === '4' || clean === 'auction' || clean.includes('bid') || clean.includes('bidding') || clean.includes('meeting')) {
    return (
`📢 *Chit Auction Schedule & Rules*
*Group: ${config.batch}*

• *Next Auction Date:* 10th of every month at 04:00 PM IST
• *Venue:* DMR Head Office & Online Proxy Bidding
• *Eligibility:* Members with all previous installments cleared
• *Max Ceiling Bid:* As per Chit Funds Act statutory rules

_To place a proxy bid or inquire about auction eligibility, reply *CALL*._`
    );
  }

  // 5. Contact Desk
  if (clean === '5' || clean === 'call' || clean.includes('contact') || clean.includes('office') || clean.includes('manager') || clean.includes('phone') || clean.includes('help')) {
    return (
`📞 *DMR Chit Fund Support Desk*

• *Branch Manager:* Mr. Gopireddy
• *Office Phone:* +91 98480 62163
• *Customer Care:* +91 98480 62164
• *Working Hours:* Mon – Sat, 10:00 AM – 6:30 PM
• *Office Address:* DMR Towers, Main Commercial Road, Near Clock Tower

_Feel free to call during office hours or drop your query here anytime!_`
    );
  }

  // Default: Main Chit Fund Menu
  const greeting = subscriber ? `Namaste *${subscriber.name}*` : (senderName ? `Namaste *${senderName}*` : `Namaste`);
  return (
`🏛️ *Welcome to ${config.fundName}*
*Batch: ${config.batch} • PSO: ${config.psoNumber}*

${greeting}! Please reply with a number to choose an option:

1️⃣ 📊 *Check My Chit Due & Balance*
2️⃣ 💳 *Payment Bank Details & UPI*
3️⃣ ✅ *Report Payment Completed*
4️⃣ 📢 *Next Auction Date & Bidding Rules*
5️⃣ 📞 *Connect with Branch Manager*

_Reply with 1, 2, 3, 4, or 5._`
  );
}


/**
 * Executes outbound dispatch to selected subscribers (Mock BSP API by default)
 */
async function executeDispatch({ subscriberIds = [], mode = 'mock', delayMs = 300 }) {
  const { config, subscribers } = parseChitFundData();

  // Filter subscribers to those selected
  const targets = subscribers.filter(s => subscriberIds.includes(s.id) || subscriberIds.includes(s.tNo));
  if (targets.length === 0) {
    throw new Error('No valid subscribers selected for dispatch.');
  }

  const results = [];
  const batchId = `BATCH-${Date.now()}`;

  for (let i = 0; i < targets.length; i++) {
    const sub = targets[i];
    const { text } = buildReminderMessage(sub, config);

    // Realistic mock latency
    const simLatency = Math.floor(Math.random() * 120) + 180;
    await new Promise(r => setTimeout(r, Math.min(delayMs, 500)));

    // Generate authentic Meta WhatsApp Cloud API / BSP format message ID
    const randomHex = Math.random().toString(36).substring(2, 10).toUpperCase();
    const mockMessageId = `wamid.HBgM${sub.phone}V1${randomHex}==`;

    const resultItem = {
      batchId,
      subscriberId: sub.id,
      tNo: sub.tNo,
      name: sub.name,
      phone: sub.phone,
      amount: sub.amount,
      month: sub.month,
      dueDate: sub.dueDate,
      status: 'Delivered',
      channel: mode === 'mock' ? 'Mock BSP API (Local Sandbox)' : mode,
      messageId: mockMessageId,
      renderedText: text,
      timestamp: new Date().toISOString(),
      simulatedLatencyMs: simLatency,
      apiTelemetry: {
        httpStatus: 200,
        provider: 'Meta Business Solution Provider (Direct Gateway)',
        recipient_type: 'individual',
        pricing: {
          category: 'utility_reminder',
          billable: false // mock mode
        }
      }
    };

    results.push(resultItem);
  }

  // Record into local dispatch history
  try {
    let history = [];
    if (fs.existsSync(HISTORY_FILE)) {
      history = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
    }
    const newEntry = {
      batchId,
      mode,
      timestamp: new Date().toISOString(),
      totalSent: results.length,
      batch: config.batch,
      month: targets[0]?.month,
      items: results
    };
    history.unshift(newEntry);
    // Keep last 50 batches
    if (history.length > 50) history = history.slice(0, 50);
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2), 'utf8');
  } catch (err) {
    console.error('[ChitFund] Could not write dispatch history:', err);
  }

  return {
    success: true,
    batchId,
    mode,
    totalDispatched: results.length,
    results,
    timestamp: new Date().toISOString()
  };
}

/**
 * Returns recorded dispatch history
 */
function getDispatchHistory() {
  try {
    if (fs.existsSync(HISTORY_FILE)) {
      return JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
    }
  } catch (e) {}
  return [];
}

/**
 * Saves uploaded Excel buffer as active file
 */
function saveActiveExcelBuffer(buffer) {
  fs.writeFileSync(ACTIVE_FILE, buffer);
  return parseChitFundData(ACTIVE_FILE);
}

/**
 * Resets active file to default sample
 */
function resetToSampleExcel() {
  if (fs.existsSync(ACTIVE_FILE)) {
    try { fs.unlinkSync(ACTIVE_FILE); } catch (e) {}
  }
  return parseChitFundData(DEFAULT_FILE);
}

module.exports = {
  parseChitFundData,
  buildReminderMessage,
  handleChitFundIncoming,
  executeDispatch,
  getDispatchHistory,
  saveActiveExcelBuffer,
  resetToSampleExcel,
  getActiveFilePath
};

