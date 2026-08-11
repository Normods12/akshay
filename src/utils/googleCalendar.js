/**
 * googleCalendar.js — Helper utility for generating Google Calendar event creation URLs
 */

export function generateGoogleCalendarUrl({
  title,
  description,
  serviceTitle,
  servicePrice,
  name,
  whatsapp,
  email,
  birthDate,
  birthTime,
  birthPlace,
  notes,
  bookingType,
  location = 'Online (Zoom / WhatsApp)',
  date,
  timeSlot,
}) {
  // Parse date and time into start/end timestamps
  const eventDate = date ? new Date(date) : new Date();
  
  let hours = 10;
  let minutes = 0;

  if (timeSlot) {
    const match = timeSlot.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
    if (match) {
      hours = parseInt(match[1], 10);
      minutes = parseInt(match[2], 10);
      const ampm = match[3] ? match[3].toUpperCase() : null;
      if (ampm === 'PM' && hours < 12) hours += 12;
      if (ampm === 'AM' && hours === 12) hours = 0;
    }
  }

  const startDate = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate(), hours, minutes);
  // Default duration 1 hour
  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

  const formatCalTime = (d) => {
    return d.toISOString().replace(/-|:|\.\d\d\d/g, '');
  };

  const datesParam = `${formatCalTime(startDate)}/${formatCalTime(endDate)}`;

  const finalTitle = title || `Mannjyotish: ${serviceTitle || 'Astrological Consultation'}${name ? ` - ${name}` : ''}`;

  let finalDescription = description;
  if (!finalDescription) {
    const descLines = [];
    if (serviceTitle) descLines.push(`🔮 Service: ${serviceTitle}${servicePrice ? ` (${servicePrice})` : ''}`);
    if (bookingType) descLines.push(`📍 Mode: ${bookingType === 'pooja' ? 'Temple Campus, Bhind, MP' : 'Online Zoom / WhatsApp'}`);
    if (name) descLines.push(`👤 Client Name: ${name}`);
    if (whatsapp) descLines.push(`📱 WhatsApp: ${whatsapp}`);
    if (email) descLines.push(`📧 Email: ${email}`);
    if (birthDate || birthTime || birthPlace) {
      descLines.push(`🎂 Birth Details: Date: ${birthDate || 'N/A'}, Time: ${birthTime || 'N/A'}, Place: ${birthPlace || 'N/A'}`);
    }
    if (notes) descLines.push(`📝 Notes: ${notes}`);
    descLines.push(`----------------------------------------`);
    descLines.push(`Booked via Mannjyotish Vedic Astrology Platform`);

    finalDescription = descLines.join('\n');
  }

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: finalTitle,
    dates: datesParam,
    details: finalDescription,
    location: location || (bookingType === 'pooja' ? 'Temple Campus, Bhind, MP' : 'Online (Zoom / WhatsApp)'),
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
