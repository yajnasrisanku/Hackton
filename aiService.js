/**
 * CalmPath AI - Google Gemini AI Service
 * Connects to Google Gemini API for personalized wellbeing resets and study planning.
 * Enforces strict safety, non-diagnostic constraints, and structured JSON schemas.
 */

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export class GeminiAIService {
  /**
   * System Prompt enforcing non-diagnostic, student-focused role & structured schema
   */
  static getSystemInstruction() {
    return `You are CalmPath AI, a student wellbeing and study-support personalization engine.
Your purpose is to help overwhelmed students take a targeted, micro-duration reset (3-15 minutes) to regulate cognitive overload, decrease academic stress, and refocus on their coursework.

STRICT SAFETY & ETHICAL BOUNDARIES:
- You are strictly an educational study-support and wellbeing tool.
- You must NEVER provide medical or psychiatric diagnoses or claim to treat/cure mental health conditions.
- You must NEVER recommend changing medication or replace professional care.
- Use supportive, non-judgmental, empowering language. Always frame observations around "self-reported" metrics.

OUTPUT REQUIREMENTS:
You must respond with ONLY valid JSON (no markdown formatting, no code fences, no extra text) matching this schema:
{
  "title": "string (Creative, motivating reset title)",
  "category": "Breathing/calm" | "Movement" | "Reflection" | "Planning" | "Quick study reset",
  "duration": number (Total minutes, matching requested duration),
  "reason": "string (Tailored explanation of why this specific sequence was crafted for the student, referencing their stress/focus scores and history)",
  "steps": [
    {
      "name": "string (Step title)",
      "durationSeconds": number (Step duration in seconds; all step durations must sum to total duration in seconds),
      "instructions": "string (Clear, actionable, student-friendly guidance)",
      "cue": "breathe-in" | "breathe-hold" | "breathe-out" | "stretch" | "movement" | "write" | "organize" | "observe" | "reflect" | "finish",
      "tip": "string (Helpful micro-tip)"
    }
  ],
  "studyAction": "string (Specific immediate 5-minute action to take upon resuming study)",
  "encouragement": "string (Supportive non-diagnostic closing statement)"
}`;
  }

  /**
   * Calls Google Gemini API to generate a personalized reset activity
   * @param {Object} checkin { stress, focus, energy, reason, duration, preference }
   * @param {Object} profile Student personalization profile from PersonalizationEngine
   * @param {Array} studyTasks Current active study tasks
   * @param {string} apiKey Gemini API Key
   * @returns {Promise<Object|null>} Structured AI Reset or null on failure
   */
  static async generatePersonalizedReset(checkin, profile, studyTasks = [], apiKey = null) {
    if (!apiKey) {
      console.log('No Gemini API key provided. Using local personalization engine.');
      return null;
    }

    try {
      const activeTaskTitles = studyTasks.filter(t => !t.completed).map(t => `${t.title} (Due: ${t.due})`).join(', ') || 'General Study Session';
      
      const userPrompt = `Generate a personalized student reset for this context:
STUDENT CHECK-IN METRICS:
- Self-Reported Stress: ${checkin.stress}/10
- Self-Reported Focus: ${checkin.focus}/10
- Self-Reported Energy: ${checkin.energy}/10
- Current Stress Factor: "${checkin.reason || 'General study fatigue'}"
- Available Duration: ${checkin.duration} minutes (${checkin.duration * 60} seconds total)
- Category Preference: "${checkin.preference || 'Any'}"

ACADEMIC WORKLOAD CONTEXT:
- Upcoming Tasks: ${activeTaskTitles}

HISTORICAL LEARNING CONTEXT:
- Most Effective Style for this Student: "${profile.topEffectiveCategory || 'Breathing/calm'}"
- Key Historical Pattern: "${profile.personalizedInsights?.[0] || 'First session'}"

Craft an evidence-informed, engaging micro-reset activity with clear step-by-step guidance totaling exactly ${checkin.duration * 60} seconds across all steps.
Respond with pure raw JSON only.`;

      const response = await fetch(`${GEMINI_API_BASE}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: `${this.getSystemInstruction()}\n\n${userPrompt}` }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1200,
            responseMimeType: 'application/json'
          }
        })
      });

      if (!response.ok) {
        console.warn(`Gemini API returned status ${response.status}: ${response.statusText}`);
        return null;
      }

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) return null;

      const parsed = this.cleanAndParseJSON(rawText);
      return this.validateAndNormalizeAIReset(parsed, checkin);
    } catch (err) {
      console.warn('Gemini API call failed, safely falling back to local personalization engine:', err);
      return null;
    }
  }

  /**
   * Cleans potential markdown formatting and parses JSON safely
   */
  static cleanAndParseJSON(text) {
    let clean = text.trim();
    if (clean.startsWith('```json')) {
      clean = clean.replace(/^```json/, '').replace(/```$/, '').trim();
    } else if (clean.startsWith('```')) {
      clean = clean.replace(/^```/, '').replace(/```$/, '').trim();
    }
    return JSON.parse(clean);
  }

  /**
   * Validates structure and normalizes steps/timing
   */
  static validateAndNormalizeAIReset(data, checkin) {
    if (!data || typeof data !== 'object') return null;
    if (!data.title || !Array.isArray(data.steps) || data.steps.length === 0) return null;

    const duration = Number(data.duration) || Number(checkin.duration) || 5;
    const targetTotalSeconds = duration * 60;

    // Normalize steps
    let currentSum = 0;
    const normalizedSteps = data.steps.map((step, idx) => {
      const dur = Math.max(5, Number(step.durationSeconds) || 30);
      currentSum += dur;
      return {
        name: step.name || step.title || `Step ${idx + 1}`,
        durationSeconds: dur,
        instructions: step.instructions || step.instruction || 'Follow the rhythm and stay present.',
        cue: step.cue || 'observe',
        tip: step.tip || 'Take your time and focus on the current step.'
      };
    });

    // Scale steps proportionally if they don't match the exact requested total seconds
    if (currentSum > 0 && Math.abs(currentSum - targetTotalSeconds) > 5) {
      const factor = targetTotalSeconds / currentSum;
      let adjustedSum = 0;
      normalizedSteps.forEach((s, idx) => {
        if (idx === normalizedSteps.length - 1) {
          s.durationSeconds = Math.max(5, targetTotalSeconds - adjustedSum);
        } else {
          s.durationSeconds = Math.max(5, Math.round(s.durationSeconds * factor));
          adjustedSum += s.durationSeconds;
        }
      });
    }

    return {
      title: data.title,
      category: data.category || checkin.preference || 'Breathing/calm',
      durationMinutes: duration,
      reason: data.reason || `Personalized reset based on your reported stress (${checkin.stress}/10) and focus (${checkin.focus}/10).`,
      steps: normalizedSteps,
      studyAction: data.studyAction || 'Review your top study priority for 15 focused minutes.',
      encouragement: data.encouragement || 'You are ready to return to studying with renewed mental clarity.',
      isAiGenerated: true
    };
  }
}
