/**
 * Baitlab AI Integration
 * Uses Hugging Face Inference API (free tier) with smart fallback simulation.
 *
 * To enable real AI responses:
 *   1. Get a free token at https://huggingface.co/settings/tokens
 *   2. Set window.BAITLAB_HF_TOKEN = "hf_YOUR_TOKEN" before loading this script
 *      OR set it in localStorage: localStorage.setItem('baitlab_hf_token', 'hf_...')
 */

const BaitlabAI = (() => {
  const HF_API = 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3';

  /** Get user-supplied token (if any) */
  function getToken() {
    return (
      (typeof window !== 'undefined' && window.BAITLAB_HF_TOKEN) ||
      (typeof localStorage !== 'undefined' && localStorage.getItem('baitlab_hf_token')) ||
      null
    );
  }

  /** Try real HuggingFace inference */
  async function queryHF(prompt) {
    const token = getToken();
    if (!token) return null;

    const body = {
      inputs: `<s>[INST] You are Baitlab, an AI assistant that helps with calls, scheduling, reminders, automation, and task execution. Be concise and direct. Reply in 1-3 sentences. User: ${prompt} [/INST]`,
      parameters: { max_new_tokens: 120, temperature: 0.7, return_full_text: false }
    };

    const res = await fetch(HF_API, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!res.ok) return null;
    const data = await res.json();
    if (Array.isArray(data) && data[0]?.generated_text) {
      return data[0].generated_text.trim();
    }
    return null;
  }

  /** Smart simulated response (always available) */
  function simulate(input) {
    const cmd = input.toLowerCase().trim();

    if (/\bcall\b/.test(cmd)) {
      const who = cmd.replace(/.*call\s*/i, '').trim() || 'contact';
      return `📞 Initiating AI call to ${who}...\n✅ Connected — conversation handled successfully.\n📋 Call summary saved to your dashboard.`;
    }
    if (/\bschedul(e|ing)\b/.test(cmd)) {
      return `📅 Checking your calendar...\n✅ Meeting scheduled — invite sent to all participants.\n🔔 Reminder set for 15 minutes before.`;
    }
    if (/\bremind\b/.test(cmd)) {
      const task = cmd.replace(/.*remind\s*(me\s*)?(about\s*)?/i, '').trim() || 'task';
      return `⏰ Reminder set for: "${task}"\n✅ You'll be notified at the right time.`;
    }
    if (/\bautomat(e|ion)\b/.test(cmd)) {
      return `⚙️  Analyzing workflow...\n🔄 Automation pipeline created.\n✅ Running — 3 steps configured and active.`;
    }
    if (/\bexecut(e|ing)\b/.test(cmd)) {
      return `⚡ Executing task...\n🔄 Processing...\n✅ Task completed successfully.`;
    }
    if (/\bhelp\b/.test(cmd)) {
      return `Available commands:\n  call [name]       — AI phone call\n  schedule [event]  — Book on calendar\n  remind [task]     — Set a reminder\n  automate [flow]   — Create automation\n  execute [task]    — Run a task\n  clear             — Clear terminal`;
    }
    if (/\bhello\b|\bhi\b|\bhey\b/.test(cmd)) {
      return `👋 Hello! I'm Baitlab AI.\nI can call contacts, schedule meetings, set reminders, automate workflows, and execute tasks.\nWhat would you like me to do?`;
    }
    if (/\bstatus\b/.test(cmd)) {
      return `🟢 All systems operational\n📞 AI Calling: Ready\n📅 Calendar: Connected\n⚙️  Automation Engine: Running\n⚡ Task Runner: Idle`;
    }
    // generic
    return `🤖 Processing: "${input.trim()}"\n✅ Baitlab AI understood your request.\n💡 Add an AI token in Settings for full AI-powered responses.`;
  }

  /**
   * Main entry point.
   * @param {string} input - User command or message
   * @param {function} onChunk - Called with each text chunk for streaming effect
   * @returns {Promise<string>} full response text
   */
  async function respond(input, onChunk) {
    if (!input.trim()) return '';

    // Try real AI first
    let text = null;
    try {
      text = await queryHF(input);
    } catch (_) { /* network error, fall through */ }

    // Fall back to simulation
    if (!text) text = simulate(input);

    // Stream the response word-by-word
    if (typeof onChunk === 'function') {
      const words = text.split(' ');
      for (let i = 0; i < words.length; i++) {
        onChunk((i === 0 ? '' : ' ') + words[i]);
        await delay(40 + Math.random() * 30);
      }
    }

    return text;
  }

  function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

  return { respond, getToken, simulate };
})();

window.BaitlabAI = BaitlabAI;
