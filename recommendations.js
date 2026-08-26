/**
 * CalmPath AI - Upgraded Recommendation Orchestrator
 * Integrates Google Gemini AI, Historical Learning Profiles, and Resilient Template Fallbacks.
 */

import { ACTIVITIES, getActivityById } from './activities.js';
import { GeminiAIService } from './aiService.js';
import { PersonalizationEngine } from './personalization.js';

export function getCategoryIcon(category) {
  if (category === 'Movement') return '🧘';
  if (category === 'Reflection') return '📝';
  if (category === 'Planning') return '🎯';
  if (category === 'Quick study reset') return '🧹';
  return '🫁';
}

/**
 * Generates an AI-personalized or historically-adapted reset recommendation
 * @param {Object} checkin { stress, focus, energy, reason, duration, preference }
 * @param {Array} history Completed sessions
 * @param {Array} studyTasks Active tasks
 * @param {string} apiKey Optional Gemini API key
 * @returns {Promise<Object>} Recommendation object
 */
export async function generateRecommendation(checkin, history = [], studyTasks = [], apiKey = null) {
  const profile = PersonalizationEngine.analyzeHistory(history, studyTasks);

  // 1. Attempt Gemini AI Generation
  if (apiKey) {
    try {
      const aiResult = await GeminiAIService.generatePersonalizedReset(checkin, profile, studyTasks, apiKey);
      if (aiResult && aiResult.steps && aiResult.steps.length > 0) {
        const dynamicActivity = {
          id: 'ai-personalized-' + Date.now(),
          title: aiResult.title,
          category: aiResult.category || checkin.preference || 'Breathing/calm',
          icon: getCategoryIcon(aiResult.category),
          tagline: 'AI-tailored micro-reset designed for your current workload & state.',
          description: aiResult.reason,
          targetDurations: [aiResult.durationMinutes],
          getSteps: () => aiResult.steps
        };

        return {
          activity: dynamicActivity,
          durationMinutes: aiResult.durationMinutes,
          rationale: aiResult.reason,
          steps: aiResult.steps,
          studyAction: aiResult.studyAction,
          encouragement: aiResult.encouragement,
          isAiGenerated: true,
          profile,
          checkinSnapshot: {
            stress: checkin.stress,
            focus: checkin.focus,
            energy: checkin.energy,
            reason: checkin.reason,
            duration: checkin.duration,
            preference: checkin.preference,
            timestamp: new Date().toISOString()
          }
        };
      }
    } catch (e) {
      console.warn('AI service error, smoothly continuing with local personalization engine:', e);
    }
  }

  // 2. Local Personalization & Pattern-Weighted Fallback Engine
  const stress = Number(checkin.stress) || 5;
  const focus = Number(checkin.focus) || 5;
  const energy = Number(checkin.energy) || 5;
  const reason = checkin.reason || 'Other';
  const duration = Number(checkin.duration) || 5;
  const preference = checkin.preference || profile.topEffectiveCategory || 'Breathing/calm';

  let selectedActivityId = 'box-breathing';
  let rationale = '';

  // Check if historical profile has a strong positive pattern
  const topCategory = profile.topEffectiveCategory;
  const hasStrongPattern = profile.hasHistory && profile.categoryStats[topCategory]?.sessions >= 2;

  if (preference === 'Movement') {
    if (energy <= 3 || reason === 'Feeling tired') {
      selectedActivityId = 'energy-shakeout';
      rationale = `Your reported energy is low (${energy}/10). An active movement shakeout will stimulate blood circulation and wake up your nervous system without caffeine.`;
    } else {
      selectedActivityId = 'desk-stretch';
      rationale = `You preferred physical movement. Releasing neck and shoulder tension from sitting at your desk will improve physical comfort and alertness.`;
    }
  } else if (preference === 'Planning') {
    selectedActivityId = 'priority-triage';
    rationale = `With "${reason}" on your mind, breaking your workload into 3 clear priorities will eliminate choice overload and clarify your next study move.`;
  } else if (preference === 'Reflection') {
    if (reason === 'Exam pressure' || reason === 'Future/career pressure') {
      selectedActivityId = 'perspective-reframe';
      rationale = `Your reported stress is elevated due to ${reason.toLowerCase()}. A guided reality-check reflection will help temper catastrophic thoughts and restore perspective.`;
    } else {
      selectedActivityId = 'brain-dump';
      rationale = `Your focus is self-rated at ${focus}/10. An unfiltered brain dump will clear competing thoughts out of your working memory onto paper.`;
    }
  } else if (preference === 'Quick study reset') {
    selectedActivityId = 'desk-clear-restart';
    rationale = `You selected a quick study reset. Clearing your desk and digital clutter creates a psychological clean slate for your next study sprint.`;
  } else {
    // Dynamic rule prioritization
    if (stress >= 7 && focus <= 4) {
      selectedActivityId = 'box-breathing';
      rationale = `Your reported stress is high (${stress}/10) and focus is low (${focus}/10). Box breathing activates your parasympathetic nervous system to quickly steady your heart rate.`;
    } else if (stress >= 7) {
      selectedActivityId = 'sensory-grounding';
      rationale = `Your reported stress is ${stress}/10. The 5-4-3-2-1 sensory grounding technique interrupts spiraling worry and anchors you in the present.`;
    } else if (energy <= 3) {
      selectedActivityId = 'energy-shakeout';
      rationale = `Your reported energy is low (${energy}/10). A brief movement break is the fastest physiological reset to overcome afternoon study lethargy.`;
    } else if (reason === 'Too much to study' || reason === 'Assignment/deadline') {
      selectedActivityId = 'priority-triage';
      rationale = `When facing ${reason.toLowerCase()}, structured priority triage helps you regain a sense of control and plan your next 20 minutes.`;
    } else {
      selectedActivityId = 'box-breathing';
      rationale = `Your reported stress is ${stress}/10 and focus is ${focus}/10. Taking a calm breathing reset creates the headspace you need to return to studying.`;
    }
  }

  // If student has a strong historical pattern, enrich rationale
  if (hasStrongPattern && topCategory === preference) {
    rationale += ` (Note: Based on your previous self-reported check-ins, ${topCategory.toLowerCase()} resets have produced your best focus gains).`;
  }

  const activity = getActivityById(selectedActivityId);
  const steps = activity.getSteps(duration);

  return {
    activity,
    durationMinutes: duration,
    rationale,
    steps,
    studyAction: 'Take 1 small study section and work on it for 20 focused minutes.',
    encouragement: 'Taking regular micro-resets supports sustainable study endurance.',
    isAiGenerated: false,
    profile,
    checkinSnapshot: {
      stress,
      focus,
      energy,
      reason,
      duration,
      preference,
      timestamp: new Date().toISOString()
    }
  };
}
