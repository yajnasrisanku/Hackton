/**
 * CalmPath AI - Adaptive Study Plan Service
 * Creates balanced, evidence-informed study block schedules tailored to student energy & workload.
 */

import { GeminiAIService } from './aiService.js';

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export class StudyPlanService {
  /**
   * Generates an adaptive study schedule using Gemini AI or Local Adaptive Planner
   * @param {Array} tasks 
   * @param {Object} checkin { stress, focus, energy }
   * @param {Object} profile 
   * @param {string} apiKey 
   * @returns {Promise<Object>} Structured study plan
   */
  static async generateStudyPlan(tasks = [], checkin = {}, profile = {}, apiKey = null) {
    const activeTasks = tasks.filter(t => !t.completed);
    
    // Try Gemini AI generation if API key is provided
    if (apiKey) {
      try {
        const aiPlan = await this.generateWithGemini(activeTasks, checkin, profile, apiKey);
        if (aiPlan) return aiPlan;
      } catch (e) {
        console.warn('Gemini Study Plan generation failed. Using local adaptive engine.', e);
      }
    }

    // Fallback: Local Adaptive Study Planner
    return this.generateLocalPlan(activeTasks, checkin, profile);
  }

  /**
   * Local Adaptive Study Planner fallback
   */
  static generateLocalPlan(activeTasks, checkin, profile) {
    const stress = Number(checkin.stress) || 6;
    const focus = Number(checkin.focus) || 4;
    const energy = Number(checkin.energy) || 5;

    const timeline = [];
    let currentTime = new Date();
    
    // Helper to format start time
    const formatBlockTime = (date) => {
      return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    };

    // Block 1: Initial Reset if stress is high or focus is low
    if (stress >= 6 || focus <= 5) {
      const resetDuration = 5;
      const startTime = formatBlockTime(currentTime);
      currentTime = new Date(currentTime.getTime() + resetDuration * 60000);
      
      timeline.push({
        type: 'reset',
        title: '5-Minute Mindset Reset',
        durationMinutes: resetDuration,
        startTime,
        endTime: formatBlockTime(currentTime),
        description: 'Settle cognitive friction and oxygenate your brain before opening study materials.',
        icon: '🌿'
      });
    }

    // Allocate tasks into sustainable 20-25 min blocks
    const taskList = activeTasks.length > 0 ? activeTasks : [
      { title: 'Priority Coursework Review', tag: 'Core Focus', due: 'Today' }
    ];

    taskList.slice(0, 3).forEach((task, idx) => {
      // Focus Study Block
      const focusDuration = energy <= 3 ? 20 : 25;
      const startStudy = formatBlockTime(currentTime);
      currentTime = new Date(currentTime.getTime() + focusDuration * 60000);

      timeline.push({
        type: 'study',
        title: task.title,
        tag: task.tag || 'Study Block',
        durationMinutes: focusDuration,
        startTime: startStudy,
        endTime: formatBlockTime(currentTime),
        description: `Dedicated single-task focus block. Hide distracting browser tabs and notifications.`,
        icon: '🎯'
      });

      // Insert restorative break between blocks
      if (idx < taskList.length - 1 || taskList.length === 1) {
        const breakDuration = 5;
        const startBreak = formatBlockTime(currentTime);
        currentTime = new Date(currentTime.getTime() + breakDuration * 60000);

        timeline.push({
          type: 'break',
          title: 'Hydration & Posture Break',
          durationMinutes: breakDuration,
          startTime: startBreak,
          endTime: formatBlockTime(currentTime),
          description: 'Step away from your screen, drink cool water, and stretch your shoulders.',
          icon: '💧'
        });
      }
    });

    return {
      title: 'Adaptive Study Block Plan',
      rationale: `Structured for your current reported stress (${stress}/10) and energy (${energy}/10). Incorporates micro-breaks to sustain cognitive stamina.`,
      timeline,
      totalStudyMinutes: timeline.filter(b => b.type === 'study').reduce((acc, b) => acc + b.durationMinutes, 0),
      totalBreakMinutes: timeline.filter(b => b.type !== 'study').reduce((acc, b) => acc + b.durationMinutes, 0),
      isAiGenerated: false
    };
  }

  /**
   * Calls Gemini to generate a tailored study plan
   */
  static async generateWithGemini(activeTasks, checkin, profile, apiKey) {
    const prompt = `Create a realistic, sustainable 90-minute study block schedule for a student.
STUDENT STATE:
- Stress: ${checkin.stress || 6}/10
- Focus: ${checkin.focus || 4}/10
- Energy: ${checkin.energy || 5}/10
- Active Tasks: ${activeTasks.map(t => `${t.title} (${t.tag})`).join(', ') || 'General study review'}

SAFETY & PACING RULES:
- Never promote all-nighters or continuous studying without breaks.
- Include 5-minute micro-resets between 20-25 minute study blocks.
- Respond with pure raw JSON only matching this schema:
{
  "title": "string",
  "rationale": "string",
  "timeline": [
    {
      "type": "reset" | "study" | "break",
      "title": "string",
      "tag": "string",
      "durationMinutes": number,
      "description": "string",
      "icon": "string"
    }
  ]
}`;

    const response = await fetch(`${GEMINI_API_BASE}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.6,
          responseMimeType: 'application/json'
        }
      })
    });

    if (!response.ok) return null;
    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) return null;

    const parsed = GeminiAIService.cleanAndParseJSON(rawText);
    if (!parsed || !Array.isArray(parsed.timeline)) return null;

    // Attach clock timestamps
    let currentTime = new Date();
    parsed.timeline.forEach(block => {
      const dur = Number(block.durationMinutes) || 20;
      block.startTime = currentTime.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
      currentTime = new Date(currentTime.getTime() + dur * 60000);
      block.endTime = currentTime.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    });

    parsed.totalStudyMinutes = parsed.timeline.filter(b => b.type === 'study').reduce((acc, b) => acc + (b.durationMinutes || 20), 0);
    parsed.totalBreakMinutes = parsed.timeline.filter(b => b.type !== 'study').reduce((acc, b) => acc + (b.durationMinutes || 5), 0);
    parsed.isAiGenerated = true;

    return parsed;
  }
}
