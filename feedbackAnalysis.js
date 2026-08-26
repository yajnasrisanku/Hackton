/**
 * CalmPath AI - Feedback & Delta Analysis
 * Computes before/after metric changes and generates non-diagnostic, supportive observations.
 */

/**
 * Analyzes before and after self-ratings
 * @param {Object} beforeScores { stress, focus, energy }
 * @param {Object} afterScores { stress, focus, energy }
 * @param {Object} activityInfo { title, durationMinutes }
 * @returns {Object} Delta analysis & supportive takeaways
 */
export function analyzeFeedback(beforeScores, afterScores, activityInfo = {}) {
  const before = {
    stress: Number(beforeScores?.stress) || 5,
    focus: Number(beforeScores?.focus) || 5,
    energy: Number(beforeScores?.energy) || 5
  };

  const after = {
    stress: Number(afterScores?.stress) || 5,
    focus: Number(afterScores?.focus) || 5,
    energy: Number(afterScores?.energy) || 5
  };

  // Deltas:
  // For Stress: negative delta means stress decreased (positive outcome)
  // For Focus & Energy: positive delta means increased (positive outcome)
  const deltas = {
    stress: after.stress - before.stress,
    focus: after.focus - before.focus,
    energy: after.energy - before.energy
  };

  // Human-readable delta statements
  const statements = [];

  // Stress statement
  if (deltas.stress < 0) {
    const pts = Math.abs(deltas.stress);
    statements.push(`Your self-rated stress decreased by ${pts} ${pts === 1 ? 'point' : 'points'}.`);
  } else if (deltas.stress === 0) {
    statements.push(`Your reported stress remained steady.`);
  } else {
    statements.push(`Your reported stress shifted by +${deltas.stress} points.`);
  }

  // Focus statement
  if (deltas.focus > 0) {
    statements.push(`Your reported focus increased by ${deltas.focus} ${deltas.focus === 1 ? 'point' : 'points'}.`);
  } else if (deltas.focus === 0) {
    statements.push(`Your reported focus remained consistent.`);
  } else {
    statements.push(`Your reported focus adjusted by ${deltas.focus} points.`);
  }

  // Energy statement
  if (deltas.energy > 0) {
    statements.push(`Your reported energy improved by ${deltas.energy} ${deltas.energy === 1 ? 'point' : 'points'}.`);
  } else if (deltas.energy === 0) {
    statements.push(`Your reported energy remained steady.`);
  } else {
    statements.push(`Your reported energy adjusted by ${deltas.energy} points.`);
  }

  // Overall primary observation
  let primaryObservation = '';
  const focusImproved = deltas.focus > 0;
  const stressDecreased = deltas.stress < 0;
  const energyImproved = deltas.energy > 0;

  if (focusImproved && stressDecreased) {
    primaryObservation = `Your self-reported focus improved and stress decreased after this reset. You are in a clearer state of mind to return to studying.`;
  } else if (stressDecreased) {
    primaryObservation = `Your self-reported stress decreased after completing "${activityInfo.title || 'this reset'}". Taking a deliberate pause helped reset your cognitive load.`;
  } else if (focusImproved) {
    primaryObservation = `Your self-reported focus improved after this reset. Use this renewed concentration for your next targeted study block.`;
  } else if (energyImproved) {
    primaryObservation = `Your self-reported energy increased after this reset, providing a helpful physical boost for your study session.`;
  } else {
    primaryObservation = `Taking time to step away from academic pressure supports sustainable study habits. Notice how your body feels as you gently resume your work.`;
  }

  return {
    before,
    after,
    deltas,
    statements,
    primaryObservation,
    activityTitle: activityInfo.title || 'Reset Activity',
    durationMinutes: activityInfo.durationMinutes || 5,
    timestamp: new Date().toISOString()
  };
}
