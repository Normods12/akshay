import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, Bot, ChevronRight, CheckCircle } from 'lucide-react';

// ── Knowledge Base: specific entries BEFORE generic ones ─────────────────────
const KNOWLEDGE_BASE = [
  // ── Consultations ──────────────────────────────────────────────────────────
  {
    keywords: ['kundli', 'birth chart', 'horoscope', 'janam patri', 'janma kundali', 'natal chart'],
    reply: "🔯 Kundli Reading (₹2,100) gives a deep analysis of your 12 houses, planetary placements, Dasha periods, and major life predictions.",
    service: { title: 'Kundli Reading', price: '₹2,100', category: 'Birth Chart Analysis', type: 'consultation' }
  },
  {
    keywords: ['palmistry', 'hand line', 'palm reading', 'hast rekha', 'palm'],
    reply: "✋ Palmistry (₹1,500) reads the lines, mounts, and shape of your hand to reveal personality, destiny, health, and life events.",
    service: { title: 'Palmistry', price: '₹1,500', category: 'Hand Line Analysis', type: 'consultation' }
  },
  {
    keywords: ['career', 'job', 'business', 'promotion', 'profession', 'work', 'employment'],
    reply: "💼 Career Guidance (₹2,500) uses Vedic astrology to map your professional path, identify auspicious windows for change, and predict financial growth.",
    service: { title: 'Career Guidance', price: '₹2,500', category: 'Professional Growth', type: 'consultation' }
  },
  {
    keywords: ['marriage', 'matchmaking', 'compatibility', 'guna', 'shaadi', 'wedding', 'partner', 'vivah'],
    reply: "💍 Marriage Match (₹3,100) evaluates 36 Guna compatibility, Mangal Dosha, and planetary harmony for a blissful union.",
    service: { title: 'Marriage Match', price: '₹3,100', category: 'Matchmaking', type: 'consultation' }
  },
  {
    keywords: ['muhurat', 'shubh muhurat', 'auspicious time', 'auspicious date', 'muhurta'],
    reply: "📅 Shubh Muhurat (₹1,100) identifies the most auspicious Vedic timing for weddings, housewarmings, or new ventures.",
    service: { title: 'Shubh Muhurat', price: '₹1,100', category: 'Auspicious Timing', type: 'consultation' }
  },
  {
    keywords: ['vastu', 'home energy', 'office vastu', 'house harmony', 'vastu shastra'],
    reply: "🏠 Vastu Consultation (₹5,000) aligns your living or working space with cosmic directions for improved health, wealth, and peace.",
    service: { title: 'Vastu Consultation', price: '₹5,000', category: 'Space Harmony', type: 'consultation' }
  },
  // ── Specific Pujas — MUST be before generic 'puja' entry ──────────────────
  {
    keywords: ['rudrabhishek', 'rudra abhishek', 'rudr abhishek', 'shiv abhishek'],
    reply: "🔱 Rudrabhishek Puja (₹11,000) is a sacred ritual of Lord Shiva where the Shivalinga is bathed with milk, honey, and holy water while Vedic mantras are chanted for blessings of health and prosperity.",
    service: { title: 'Rudrabhishek Puja', price: '₹11,000', category: 'Shiva Puja', type: 'pooja' }
  },
  {
    keywords: ['mangal dosha', 'mangal shanti', 'manglik', 'mars dosha'],
    reply: "🪬 Mangal Dosha Shanti Puja (₹21,000) neutralizes the malefic effects of Mars in your horoscope, removing obstacles in marriage and relationships.",
    service: { title: 'Mangal Dosha Shanti Puja', price: '₹21,000', category: 'Dosha Remedy', type: 'pooja' }
  },
  {
    keywords: ['navagraha', 'nav graha', '9 planets', 'nine planets', 'graha shanti'],
    reply: "🌟 Navagraha Shanti Puja (₹31,000) pacifies all nine planetary deities through elaborate rituals to bring balance, success, and peace across all life areas.",
    service: { title: 'Navagraha Shanti Puja', price: '₹31,000', category: 'Planetary Remedies', type: 'pooja' }
  },
  {
    keywords: ['satyanarayan', 'satya narayan', 'vishnu puja', 'narayan puja'],
    reply: "🙏 Satyanarayan Puja (₹5,100) is performed to seek blessings of Lord Vishnu for family harmony, prosperity, and fulfillment of wishes.",
    service: { title: 'Satyanarayan Puja', price: '₹5,100', category: 'Vishnu Puja', type: 'pooja' }
  },
  {
    keywords: ['kalsarp', 'kal sarp', 'kaal sarp', 'serpent dosha', 'rahu ketu'],
    reply: "🐍 Kalsarp Dosha Shanti (₹15,000) removes the powerful Kalsarp Dosha formed when all planets are hemmed between Rahu and Ketu, bringing relief from obstacles and delays.",
    service: { title: 'Kalsarp Dosha Shanti', price: '₹15,000', category: 'Dosha Remedy', type: 'pooja' }
  },
  {
    keywords: ['pitru', 'pitra', 'ancestor', 'pitrudosh', 'pind daan'],
    reply: "🕯️ Pitru Dosha Shanti Puja (₹11,000) appeases ancestral souls to remove Pitru Dosha and bring blessings of health, progeny, and prosperity to your family.",
    service: { title: 'Pitru Dosha Shanti Puja', price: '₹11,000', category: 'Ancestor Ritual', type: 'pooja' }
  },
  // ── Generic puja list ──────────────────────────────────────────────────────
  {
    keywords: ['puja', 'pooja', 'ritual', 'homa', 'havan', 'yagna', 'what puja'],
    reply: "🪔 We perform 18+ authentic Vedic Pujas at our Bhind Temple Campus. Popular ones include:",
    service: null,
    pujaList: true
  },
  // ── About ──────────────────────────────────────────────────────────────────
  {
    keywords: ['ashay', 'astrologer', 'mannjyotish', 'who are you', 'about', 'experience', 'certified'],
    reply: "🌙 Mannjyotish is led by Astrologer Ashay Krishn Goswami — an ISO-certified Vedic astrologer with years of experience in Kundli analysis, Palmistry, and temple rituals. Based in Bhind, Madhya Pradesh.",
  }
];

const ALL_PUJAS = [
  { title: 'Navagraha Shanti Puja', price: '₹31,000', category: 'Planetary Remedies', type: 'pooja' },
  { title: 'Mangal Dosha Shanti Puja', price: '₹21,000', category: 'Dosha Remedy', type: 'pooja' },
  { title: 'Kalsarp Dosha Shanti', price: '₹15,000', category: 'Dosha Remedy', type: 'pooja' },
  { title: 'Rudrabhishek Puja', price: '₹11,000', category: 'Shiva Puja', type: 'pooja' },
  { title: 'Pitru Dosha Shanti Puja', price: '₹11,000', category: 'Ancestor Ritual', type: 'pooja' },
  { title: 'Satyanarayan Puja', price: '₹5,100', category: 'Vishnu Puja', type: 'pooja' },
];

// ── In-chat booking wizard steps ─────────────────────────────────────────────
const BOOKING_STEPS = ['name', 'email', 'phone', 'date', 'time', 'confirm', 'done'];

const STEP_PROMPTS = {
  name:    "✏️ Please share your **full name**:",
  email:   "📧 What is your **email address**?",
  phone:   "📱 What is your **WhatsApp / phone number**?",
  date:    "📅 What **date** would you prefer? (e.g. 2026-08-20)",
  time:    "🕐 What **time slot** works for you? (e.g. 10:00 AM, 2:00 PM, 4:30 PM)",
};

export default function AiChatbot({ onBookService }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{
    id: 1, sender: 'bot',
    text: "🙏 Namaste! I am Jyotish AI. I can tell you about our services and book your appointment right here in chat! What would you like to know?",
  }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [lastMentionedService, setLastMentionedService] = useState(null);

  // In-chat booking wizard state
  const [bookingStep, setBookingStep] = useState(null); // null = not in wizard
  const [bookingData, setBookingData] = useState({});
  const [bookingService, setBookingService] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [messages, isOpen]);

  const addBotMessage = (text, extras = {}) => {
    setMessages(prev => [...prev, { id: Date.now() + Math.random(), sender: 'bot', text, ...extras }]);
  };

  // ── Starts the in-chat booking wizard for a given service ──────────────────
  const startBookingWizard = (service) => {
    setBookingService(service);
    setBookingData({});
    setBookingStep('name');
    addBotMessage(
      `🎉 Starting your booking for **${service.title}** (${service.price})!\n\n${STEP_PROMPTS.name}`
    );
  };

  // ── Handles a wizard step response from the user ───────────────────────────
  const handleWizardStep = async (value) => {
    const v = value.trim();

    if (bookingStep === 'name') {
      setBookingData(d => ({ ...d, name: v }));
      setBookingStep('email');
      addBotMessage(`Thanks, ${v}! 😊\n\n${STEP_PROMPTS.email}`);

    } else if (bookingStep === 'email') {
      if (!/\S+@\S+\.\S+/.test(v)) {
        addBotMessage("⚠️ That doesn't look like a valid email. Please enter a valid email address:");
        return;
      }
      setBookingData(d => ({ ...d, email: v }));
      setBookingStep('phone');
      addBotMessage(STEP_PROMPTS.phone);

    } else if (bookingStep === 'phone') {
      setBookingData(d => ({ ...d, phone: v }));
      setBookingStep('date');
      addBotMessage(STEP_PROMPTS.date);

    } else if (bookingStep === 'date') {
      setBookingData(d => ({ ...d, date: v }));
      setBookingStep('time');
      addBotMessage(STEP_PROMPTS.time);

    } else if (bookingStep === 'time') {
      const data = { ...bookingData, time: v };
      setBookingData(data);
      setBookingStep('confirm');
      addBotMessage(
        `✅ Here's your booking summary:\n\n` +
        `📿 **Service:** ${bookingService.title} (${bookingService.price})\n` +
        `👤 **Name:** ${data.name}\n` +
        `📧 **Email:** ${data.email}\n` +
        `📱 **Phone:** ${data.phone}\n` +
        `📅 **Date:** ${data.date}\n` +
        `🕐 **Time:** ${v}\n\n` +
        `Type **confirm** to book, or **cancel** to start over.`,
        { isConfirmStep: true }
      );

    } else if (bookingStep === 'confirm') {
      const lv = v.toLowerCase();
      if (/^(cancel|no|nahi|nope|back)$/i.test(lv)) {
        setBookingStep(null);
        setBookingService(null);
        setBookingData({});
        addBotMessage("No problem! Booking cancelled. How else can I help you?");
        return;
      }
      if (!/^(confirm|yes|ok|okay|haan|book|proceed|done|submit)$/i.test(lv)) {
        addBotMessage("Please type **confirm** to book or **cancel** to start over.");
        return;
      }

      // ── Submit booking to backend ──────────────────────────────────────────
      setBookingStep('done');
      addBotMessage("⏳ Submitting your booking...");
      try {
        const res = await fetch('/api/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: bookingData.name,
            email: bookingData.email,
            whatsapp: bookingData.phone,
            serviceTitle: bookingService.title,
            servicePrice: bookingService.price,
            serviceCategory: bookingService.category,
            bookingDate: bookingData.date,
            bookingTimeSlot: bookingData.time,
            bookingType: bookingService.type || 'consultation',
            notes: 'Booked via Jyotish AI Chat',
          }),
        });
        const result = await res.json();
        if (result.success || result.booking) {
          addBotMessage(
            `🎉 **Booking Confirmed!**\n\n` +
            `Your ${bookingService.title} session is scheduled for **${bookingData.date}** at **${bookingData.time}**.\n\n` +
            `📧 A confirmation email + calendar invite has been sent to **${bookingData.email}**.\n` +
            `The event will appear on your Google Calendar automatically!\n\n` +
            `🙏 Jai Shri Ram! See you at your session, ${bookingData.name}!`,
            { isSuccess: true }
          );
        } else {
          throw new Error(result.error || 'Booking failed');
        }
      } catch (err) {
        addBotMessage(
          `⚠️ Could not submit automatically. Please contact Ashay ji directly:\n📱 **WhatsApp: +91 92438 18146**\n\nMention: ${bookingService.title} on ${bookingData.date} at ${bookingData.time}`
        );
      }
      setBookingStep(null);
      setBookingService(null);
      setBookingData({});
    }
  };

  // ── Main message handler ───────────────────────────────────────────────────
  const handleSend = async (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: query }]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    await new Promise(r => setTimeout(r, 500));
    setIsTyping(false);

    // ── If we're inside the booking wizard, handle wizard logic ───────────────
    if (bookingStep && bookingStep !== 'done') {
      await handleWizardStep(query);
      return;
    }

    const qLower = query.toLowerCase().trim();

    // ── Confirmation of a previously suggested service ─────────────────────
    const isConfirm = /^(yes|yep|yeah|sure|okay|ok|haan|ha|book it|book|schedule|go ahead|confirm|proceed|hn|ji|bilkul)$/i.test(qLower);
    if (isConfirm && lastMentionedService) {
      startBookingWizard(lastMentionedService);
      return;
    }

    // ── Greetings ──────────────────────────────────────────────────────────
    if (/^(hi|hello|namaste|hey|pranam|namaskar|good morning|good evening)/i.test(qLower)) {
      addBotMessage("🙏 Namaste! How may I assist your spiritual journey today? Ask me about Kundli, Palmistry, Pujas, or type the name of any specific service!");
      return;
    }

    // ── Generic scheduling intent (no service yet) ─────────────────────────
    if (isConfirm && !lastMentionedService) {
      addBotMessage("I'd love to book you in! Which service would you like?", {
        services: [
          { title: 'Kundli Reading', price: '₹2,100', category: 'Birth Chart Analysis', type: 'consultation' },
          { title: 'Palmistry', price: '₹1,500', category: 'Hand Line Analysis', type: 'consultation' },
          { title: 'Career Guidance', price: '₹2,500', category: 'Professional Growth', type: 'consultation' },
          { title: 'Marriage Match', price: '₹3,100', category: 'Matchmaking', type: 'consultation' },
          { title: 'Navagraha Shanti Puja', price: '₹31,000', category: 'Planetary Remedies', type: 'pooja' },
        ]
      });
      return;
    }

    // ── Knowledge base keyword matching ────────────────────────────────────
    for (const entry of KNOWLEDGE_BASE) {
      if (entry.keywords.some(k => qLower.includes(k))) {
        // Generic puja list
        if (entry.pujaList) {
          addBotMessage("🪔 Our most popular Pujas at Bhind Temple Campus:", { services: ALL_PUJAS });
          return;
        }
        // Specific service match
        if (entry.service) {
          setLastMentionedService(entry.service);
          addBotMessage(`${entry.reply}\n\nWould you like to book this? Just say **yes** or tap the button below!`, {
            services: [entry.service]
          });
          return;
        }
        // Info-only entry (about, etc.)
        addBotMessage(entry.reply);
        return;
      }
    }

    // ── Appointment / schedule intent ──────────────────────────────────────
    if (/appoint|schedul|book|consult|slot|meeting|session/i.test(qLower)) {
      addBotMessage("Sure! Which service would you like to schedule?", {
        services: [
          { title: 'Kundli Reading', price: '₹2,100', category: 'Birth Chart Analysis', type: 'consultation' },
          { title: 'Palmistry', price: '₹1,500', category: 'Hand Line Analysis', type: 'consultation' },
          { title: 'Career Guidance', price: '₹2,500', category: 'Professional Growth', type: 'consultation' },
          { title: 'Marriage Match', price: '₹3,100', category: 'Matchmaking', type: 'consultation' },
          { title: 'Rudrabhishek Puja', price: '₹11,000', category: 'Shiva Puja', type: 'pooja' },
          { title: 'Navagraha Shanti Puja', price: '₹31,000', category: 'Planetary Remedies', type: 'pooja' },
        ]
      });
      return;
    }

    // ── Final fallback ─────────────────────────────────────────────────────
    addBotMessage(
      "I'm not sure I understood that. Try asking about:\n• Kundli Reading\n• Palmistry\n• Rudrabhishek Puja\n• Navagraha Puja\n• Marriage Matchmaking\n• Or say **schedule** to book a session!"
    );
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        style={{
          position: 'fixed', bottom: '24px', right: '96px', zIndex: 9990,
          padding: '12px 20px', borderRadius: '30px',
          background: 'linear-gradient(135deg, #d4af37, #b8860b)',
          color: '#000', border: '1px solid rgba(255,255,255,0.4)',
          boxShadow: '0 8px 24px rgba(212,175,55,0.4)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
          fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.85rem'
        }}
      >
        <Sparkles size={18} />
        <span>Ask Jyotish AI</span>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            style={{
              position: 'fixed', bottom: '96px', right: '24px', zIndex: 9995,
              width: 'clamp(320px, 90vw, 400px)', height: '560px',
              backgroundColor: '#121216', border: '1px solid rgba(212,175,55,0.3)',
              borderRadius: '20px', boxShadow: '0 20px 60px rgba(0,0,0,0.9)',
              display: 'flex', flexDirection: 'column', overflow: 'hidden',
              fontFamily: 'var(--font-body)', color: '#fff'
            }}
          >
            {/* Header */}
            <div style={{
              padding: '14px 18px',
              background: 'linear-gradient(135deg, #1a1a24, #0d0d12)',
              borderBottom: '1px solid rgba(212,175,55,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '34px', height: '34px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #d4af37, #b8860b)',
                  color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Bot size={18} />
                </div>
                <div>
                  <h4 style={{ margin: 0, color: '#d4af37', fontFamily: 'var(--font-heading)', fontSize: '0.9rem' }}>
                    Jyotish AI
                  </h4>
                  <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.45)' }}>
                    {bookingStep ? `📝 Booking: ${bookingService?.title}` : '✦ Ask me anything · Book in chat'}
                  </span>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)}
                style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', padding: '4px' }}>
                <X size={18} />
              </button>
            </div>

            {/* Quick chips */}
            {!bookingStep && (
              <div style={{ padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '6px', overflowX: 'auto' }}>
                {["Book Kundli Reading", "List all pujas", "Rudrabhishek Puja", "Marriage Match"].map((s, i) => (
                  <button key={i} onClick={() => handleSend(s)} style={{
                    whiteSpace: 'nowrap', padding: '4px 10px', borderRadius: '12px',
                    background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)',
                    color: '#d4af37', fontSize: '0.71rem', cursor: 'pointer'
                  }}>{s}</button>
                ))}
              </div>
            )}

            {/* Messages */}
            <div style={{ flex: 1, padding: '14px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {messages.map(msg => (
                <div key={msg.id} style={{
                  display: 'flex', flexDirection: 'column',
                  alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                }}>
                  <div style={{
                    maxWidth: '88%',
                    padding: '10px 14px',
                    borderRadius: msg.sender === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                    background: msg.sender === 'user'
                      ? 'linear-gradient(135deg, #d4af37, #b8860b)'
                      : msg.isSuccess
                        ? 'rgba(34,197,94,0.15)'
                        : 'rgba(255,255,255,0.06)',
                    color: msg.sender === 'user' ? '#000' : '#fff',
                    fontSize: '0.84rem',
                    lineHeight: 1.55,
                    fontWeight: msg.sender === 'user' ? 600 : 400,
                    border: msg.sender === 'bot'
                      ? msg.isSuccess ? '1px solid rgba(34,197,94,0.4)' : '1px solid rgba(255,255,255,0.08)'
                      : 'none',
                    whiteSpace: 'pre-line'
                  }}>
                    {msg.isSuccess && <CheckCircle size={16} style={{ marginRight: 6, color: '#22c55e', verticalAlign: 'middle' }} />}
                    {/* Render **bold** markdown */}
                    {msg.text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
                      part.startsWith('**') && part.endsWith('**')
                        ? <strong key={i}>{part.slice(2, -2)}</strong>
                        : part
                    )}
                  </div>

                  {/* Service booking buttons */}
                  {msg.services && msg.services.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '7px', width: '100%', maxWidth: '88%' }}>
                      {msg.services.map((srv, si) => (
                        <motion.button
                          key={si}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => startBookingWizard(srv)}
                          style={{
                            padding: '8px 12px', borderRadius: '10px',
                            background: 'rgba(212,175,55,0.15)',
                            border: '1px solid rgba(212,175,55,0.5)',
                            color: '#d4af37', fontSize: '0.77rem', fontWeight: 700,
                            cursor: 'pointer', display: 'flex', alignItems: 'center',
                            justifyContent: 'space-between', width: '100%'
                          }}
                        >
                          <span>📅 Book {srv.title} ({srv.price})</span>
                          <ChevronRight size={13} />
                        </motion.button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div style={{ color: '#d4af37', fontSize: '0.76rem', fontStyle: 'italic' }}>
                  Jyotish AI is thinking...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={e => { e.preventDefault(); handleSend(); }} style={{
              padding: '10px', borderTop: '1px solid rgba(255,255,255,0.07)',
              background: '#0d0d12', display: 'flex', gap: '8px'
            }}>
              <input
                ref={inputRef}
                type="text"
                placeholder={bookingStep ? `Enter ${bookingStep}...` : "Ask anything or type a service name..."}
                value={input}
                onChange={e => setInput(e.target.value)}
                style={{
                  flex: 1, padding: '10px 14px', borderRadius: '10px',
                  background: 'rgba(255,255,255,0.06)',
                  border: `1px solid ${bookingStep ? 'rgba(212,175,55,0.6)' : 'rgba(212,175,55,0.3)'}`,
                  color: '#fff', fontSize: '0.84rem', outline: 'none'
                }}
              />
              <button type="submit" style={{
                padding: '10px 14px', borderRadius: '10px',
                background: 'linear-gradient(135deg, #d4af37, #b8860b)',
                border: 'none', color: '#000', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
