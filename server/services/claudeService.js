const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

function requireEnv(name) {
  const v = process.env[name];
  if (!v) {
    const err = new Error(`${name} is required`);
    err.statusCode = 500;
    throw err;
  }
  return v;
}

function scriptSystemPrompt() {
  return [
    'You are an expert script writer for short-form and long-form content.',
    'Write clear, engaging scripts with strong hooks and natural pacing.',
    'Return ONLY the script text. No markdown fences.',
  ].join('\n');
}

function reportSystemPrompt() {
  return [
    'You are an expert analyst and editor.',
    'Generate structured, useful reports from provided sessions.',
    'Return ONLY the report content. No markdown fences.',
  ].join('\n');
}

function toScriptUserPrompt({ topic, tone, length, language, extraContext }) {
  return [
    `Topic: ${topic}`,
    `Tone: ${tone}`,
    `Length: ${length}`,
    `Language: ${language}`,
    extraContext ? `Extra context: ${extraContext}` : null,
    '',
    'Write the script now.',
  ]
    .filter(Boolean)
    .join('\n');
}

function toReportUserPrompt({ reportType, sessions, extraContext }) {
  const sessionBullets = (sessions || [])
    .map((s, idx) => {
      const topic = s.topic ? `topic="${s.topic}"` : '';
      const tone = s.tone ? `tone="${s.tone}"` : '';
      const language = s.language ? `language="${s.language}"` : '';
      const meta = [topic, tone, language].filter(Boolean).join(' ');
      const header = meta ? `Session ${idx + 1} (${meta})` : `Session ${idx + 1}`;
      const body = s.script || s.content || '';
      return `${header}\n${body}`;
    })
    .join('\n\n---\n\n');

  return [
    `Report type: ${reportType}`,
    extraContext ? `Extra context: ${extraContext}` : null,
    '',
    'Sessions:',
    sessionBullets || '(none provided)',
    '',
    'Generate the report now.',
  ]
    .filter(Boolean)
    .join('\n');
}

async function callClaude({ system, user, maxTokens }) {
  requireEnv('ANTHROPIC_API_KEY');

  const model = process.env.CLAUDE_MODEL || 'claude-3-5-sonnet-latest';
  const resp = await anthropic.messages.create({
    model,
    max_tokens: maxTokens,
    system,
    messages: [{ role: 'user', content: user }],
  });

  const text = (resp.content || [])
    .filter((c) => c.type === 'text' && typeof c.text === 'string')
    .map((c) => c.text)
    .join('')
    .trim();

  if (!text) {
    const err = new Error('Claude returned empty content');
    err.statusCode = 502;
    throw err;
  }

  return text;
}

async function generateScript(scriptPrompt /*, user */) {
  return callClaude({
    system: scriptSystemPrompt(),
    user: toScriptUserPrompt(scriptPrompt),
    maxTokens: Number(process.env.CLAUDE_MAX_TOKENS_SCRIPT || 1200),
  });
}

async function generateReport(reportPayload) {
  return callClaude({
    system: reportSystemPrompt(),
    user: toReportUserPrompt(reportPayload),
    maxTokens: Number(process.env.CLAUDE_MAX_TOKENS_REPORT || 1600),
  });
}

module.exports = {
  generateScript,
  generateReport,
};

