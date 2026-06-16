const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

export async function generateAstrologyReport(
  featureTitle: string,
  birthDetails: { name: string; date: string; time: string; location: string },
  astrologyData?: any
): Promise<string> {
  if (!OPENROUTER_API_KEY) {
    throw new Error('OpenRouter API key is missing. Please add it to your .env.local file.');
  }

  const prompt = `
You are an expert, compassionate Vedic Astrologer. 
The user is requesting a ${featureTitle}.

User Details:
Name: ${birthDetails.name || 'User'}
Birth Date: ${birthDetails.date}
Birth Time: ${birthDetails.time}
Birth Location: ${birthDetails.location || 'Unknown'}

${astrologyData ? `Calculated Astronomical Data:\n${JSON.stringify(astrologyData, null, 2)}\n` : ''}

Please write a highly personalized, detailed, and beautifully structured ${featureTitle} for this person.
Use Markdown formatting (headings, bullet points, bold text). 
Do NOT include any generic disclaimer like "I am an AI...". Provide a professional, premium astrology report.
  `.trim();

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1500,
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Failed to generate report:', error);
    throw new Error('Failed to generate astrology report. Please try again later.');
  }
}
