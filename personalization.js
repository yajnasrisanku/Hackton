/**
 * CalmPath AI - Personalization & Learning Engine
 * Analyzes historical before/after deltas and workload to personalize future recommendations.
 */

export class PersonalizationEngine {
  /**
   * Analyzes session history and builds a personalized student profile
   * @param {Array} history 
   * @param {Array} currentTasks 
   * @returns {Object} Student personalization profile & insights
   */
  static analyzeHistory(history = [], currentTasks = []) {
    if (!history || history.length === 0) {
      return {
        totalSessions: 0,
        hasHistory: false,
        topEffectiveCategory: 'Breathing/calm',
        categoryStats: {},
        personalizedInsights: [
          'Complete your first few resets to unlock personalized insights about which study breaks work best for you.'
        ],
        workloadInsight: this.computeWorkloadInsight(currentTasks, [])
      };
    }

    // Category effectiveness aggregation
    const categoryStats = {
      'Breathing/calm': { sessions: 0, totalFocusGain: 0, totalStressRelief: 0, totalEnergyGain: 0 },
      'Movement': { sessions: 0, totalFocusGain: 0, totalStressRelief: 0, totalEnergyGain: 0 },
      'Reflection': { sessions: 0, totalFocusGain: 0, totalStressRelief: 0, totalEnergyGain: 0 },
      'Planning': { sessions: 0, totalFocusGain: 0, totalStressRelief: 0, totalEnergyGain: 0 },
      'Quick study reset': { sessions: 0, totalFocusGain: 0, totalStressRelief: 0, totalEnergyGain: 0 }
    };

    let totalFocusGainOverall = 0;
    let totalStressReliefOverall = 0;

    history.forEach(session => {
      // Map activity title or preference to category
      let category = session.preference || 'Breathing/calm';
      if (!categoryStats[category]) {
        category = 'Breathing/calm';
      }

      const focusDelta = session.deltas?.focus || 0;
      const stressDelta = session.deltas?.stress || 0; // negative is good
      const energyDelta = session.deltas?.energy || 0;

      const stat = categoryStats[category];
      stat.sessions += 1;
      stat.totalFocusGain += focusDelta;
      stat.totalStressRelief += Math.max(0, -stressDelta);
      stat.totalEnergyGain += Math.max(0, energyDelta);

      totalFocusGainOverall += focusDelta;
      totalStressReliefOverall += Math.max(0, -stressDelta);
    });

    // Compute averages and effectiveness scores
    let bestCategory = 'Breathing/calm';
    let bestScore = -999;

    Object.keys(categoryStats).forEach(cat => {
      const s = categoryStats[cat];
      if (s.sessions > 0) {
        s.avgFocusGain = (s.totalFocusGain / s.sessions).toFixed(1);
        s.avgStressRelief = (s.totalStressRelief / s.sessions).toFixed(1);
        s.avgEnergyGain = (s.totalEnergyGain / s.sessions).toFixed(1);
        
        // Composite effectiveness score (weights focus gain and stress drop)
        const composite = (s.totalFocusGain / s.sessions) * 1.2 + (s.totalStressRelief / s.sessions);
        s.effectivenessScore = composite;

        if (composite > bestScore) {
          bestScore = composite;
          bestCategory = cat;
        }
      } else {
        s.avgFocusGain = '0.0';
        s.avgStressRelief = '0.0';
        s.avgEnergyGain = '0.0';
        s.effectivenessScore = 0;
      }
    });

    // Generate natural language personal insights (strict self-reported non-medical phrasing)
    const personalizedInsights = [];
    const bestStat = categoryStats[bestCategory];

    if (bestStat && bestStat.sessions >= 2 && Number(bestStat.avgFocusGain) > 0) {
      personalizedInsights.push(
        `Based on your previous self-reported check-ins, ${bestCategory.toLowerCase()}-based resets have been associated with your highest reported focus improvement (+${bestStat.avgFocusGain} average gain).`
      );
    } else if (history.length >= 2) {
      const avgGain = (totalFocusGainOverall / history.length).toFixed(1);
      personalizedInsights.push(
        `Based on your previous ${history.length} self-reported sessions, taking structured study breaks is associated with an average +${avgGain} point focus increase.`
      );
    } else {
      personalizedInsights.push(
        `Based on your previous self-reported check-in, structured resets help clear cognitive friction before your next study sprint.`
      );
    }

    // Workload correlation insight
    const workloadInsight = this.computeWorkloadInsight(currentTasks, history);
    if (workloadInsight) {
      personalizedInsights.push(workloadInsight.text);
    }

    return {
      totalSessions: history.length,
      hasHistory: true,
      topEffectiveCategory: bestCategory,
      categoryStats,
      personalizedInsights,
      workloadInsight
    };
  }

  /**
   * Evaluates academic workload and deadlines against historical stress
   */
  static computeWorkloadInsight(tasks = [], history = []) {
    const activeTasks = tasks.filter(t => !t.completed);
    if (activeTasks.length >= 3) {
      return {
        type: 'high_workload',
        title: 'Approaching Deadlines Detected',
        text: `You have ${activeTasks.length} active study tasks queued. In previous self-reported check-ins, breaking heavy workloads into smaller 20-minute chunks helped maintain study stamina.`,
        actionLabel: 'Generate Adaptive Study Plan'
      };
    } else if (activeTasks.length > 0) {
      return {
        type: 'moderate_workload',
        title: 'Active Study Tasks',
        text: `You have ${activeTasks.length} upcoming study ${activeTasks.length === 1 ? 'task' : 'tasks'}. Prioritizing single-task focus reduces cognitive overload.`,
        actionLabel: 'View Study Queue'
      };
    }
    return null;
  }
}
