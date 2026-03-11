const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const MODEL = "llama-3.3-70b-versatile";

async function generateScript({ topic, audience, duration }) {
  const completion = await groq.chat.completions.create({
    model: MODEL,
    max_tokens: 1200,
    messages: [{
      role: "user",
      content: `Write a ${duration || "3 min"} presentation speech for a ${audience || "general"} audience on: "${topic}".

Structure:
- Strong opening hook
- 3 clear main points  
- Memorable closing

Write as natural flowing speech, no headers or labels. Conversational tone, powerful delivery.`
    }]
  });

  return completion.choices[0].message.content;
}

async function generateReport({
  topic, seconds, wordCount, wpm, fillerCount,
  transcript, currentEmotion, postureScore,
  voiceCracks, eyeContact
}) {
  function formatTime(s) {
    if (!s) return "0:00";
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  }

  const completion = await groq.chat.completions.create({
    model: MODEL,
    max_tokens: 1000,
    messages: [{
      role: "user",
      content: `You are a professional presentation coach. Give a coaching report.

Topic: ${topic}
Duration: ${formatTime(seconds)}
Words spoken: ${wordCount || 0}
Average WPM: ${wpm || 0} (ideal: 120–150)
Filler words: ${fillerCount || 0}
Dominant emotion: ${currentEmotion || "neutral"}
Posture score: ${postureScore || 100}%
Voice cracks: ${voiceCracks || 0}
Eye contact: ${eyeContact ? "Yes" : "No"}
Transcript: ${transcript?.slice(0, 400) || "Not available"}

Write exactly 4 sections:
1. OVERALL SCORE — score out of 10, one sentence why
2. STRENGTHS — 2-3 specific things done well
3. AREAS TO IMPROVE — 2-3 specific actionable tips
4. NEXT SESSION FOCUS — one powerful thing to work on

Be specific, warm, encouraging. Reference actual numbers.`
    }]
  });

  return completion.choices[0].message.content;
}

module.exports = { generateScript, generateReport };