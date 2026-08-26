/**
 * CalmPath AI - Activities Catalog
 * Structured, evidence-informed reset activities tailored for students.
 */

export const ACTIVITIES = [
  // ==========================================
  // 1. BREATHING / CALM
  // ==========================================
  {
    id: 'box-breathing',
    title: 'Box Breathing Reset (4-4-4-4)',
    category: 'Breathing/calm',
    icon: '🫁',
    tagline: 'Regulate your autonomic nervous system and lower acute exam stress.',
    description: 'A proven breathing pattern used to slow down heart rate, reduce cortisol, and restore mental composure.',
    targetDurations: [3, 5, 10, 15],
    getSteps: (durationMinutes) => {
      const cycleDuration = 16; // 4s inhale, 4s hold, 4s exhale, 4s hold
      const totalSeconds = durationMinutes * 60;
      const cycles = Math.max(2, Math.floor((totalSeconds - 30) / cycleDuration));

      const steps = [
        {
          name: 'Posture Setup',
          durationSeconds: 15,
          cue: 'setup',
          instructions: 'Sit comfortably with your feet flat on the floor and shoulders relaxed. Rest your hands on your lap.',
          tip: 'Unclench your jaw and gently drop your shoulders away from your ears.'
        }
      ];

      for (let i = 1; i <= cycles; i++) {
        steps.push(
          {
            name: `Box Cycle ${i} - Inhale`,
            durationSeconds: 4,
            cue: 'breathe-in',
            instructions: 'Inhale slowly through your nose for 4 seconds, feeling your belly expand.',
            tip: 'Keep your breath smooth and steady.'
          },
          {
            name: `Box Cycle ${i} - Hold`,
            durationSeconds: 4,
            cue: 'breathe-hold',
            instructions: 'Gently hold your breath for 4 seconds without straining.',
            tip: 'Notice the stillness in your body.'
          },
          {
            name: `Box Cycle ${i} - Exhale`,
            durationSeconds: 4,
            cue: 'breathe-out',
            instructions: 'Exhale slowly through your mouth for 4 seconds, releasing all tension.',
            tip: 'Imagine study stress leaving your muscles.'
          },
          {
            name: `Box Cycle ${i} - Hold`,
            durationSeconds: 4,
            cue: 'breathe-hold',
            instructions: 'Hold empty lungs for 4 seconds before the next breath.',
            tip: 'Stay present in this quiet moment.'
          }
        );
      }

      steps.push({
        name: 'Return to Natural Rhythm',
        durationSeconds: 15,
        cue: 'finish',
        instructions: 'Resume your normal breathing rhythm. Notice how your body feels more settled.',
        tip: 'You are ready to re-approach your study materials with a steady mind.'
      });

      return steps;
    }
  },

  {
    id: 'sensory-grounding',
    title: '5-4-3-2-1 Sensory Grounding Reset',
    category: 'Breathing/calm',
    icon: '🌿',
    tagline: 'Anchor yourself in the present moment when study thoughts feel overwhelming.',
    description: 'Engage your five senses to interrupt spiraling thoughts and bring your attention back to the room.',
    targetDurations: [3, 5, 10],
    getSteps: (durationMinutes) => {
      const stepTime = Math.floor((durationMinutes * 60) / 6);
      return [
        {
          name: 'Center Your Body',
          durationSeconds: Math.min(20, stepTime),
          cue: 'setup',
          instructions: 'Take two deep, grounding breaths. Place both feet firmly on the floor.',
          tip: 'Acknowledge that you are safe in this physical space.'
        },
        {
          name: '5 Things You Can SEE',
          durationSeconds: stepTime,
          cue: 'observe',
          instructions: 'Look around your room. Mentally name 5 specific things you can see (e.g., a pen, a pattern on the desk, light on the wall).',
          tip: 'Focus on small details you normally overlook.'
        },
        {
          name: '4 Things You Can FEEL',
          durationSeconds: stepTime,
          cue: 'observe',
          instructions: 'Notice 4 physical textures or sensations (e.g., your feet against the floor, texture of your sleeves, backrest).',
          tip: 'Feel the grounded support beneath you.'
        },
        {
          name: '3 Things You Can HEAR',
          durationSeconds: stepTime,
          cue: 'observe',
          instructions: 'Listen carefully. Identify 3 distinct sounds in your environment (distant traffic, a fan, subtle hum).',
          tip: 'Do not judge the sounds—simply register their presence.'
        },
        {
          name: '2 Things You Can SMELL or TASTE',
          durationSeconds: stepTime,
          cue: 'observe',
          instructions: 'Notice any scent in the air (coffee, fresh air, paper) or the taste of water or mint.',
          tip: 'Sensory awareness grounds your cognitive focus.'
        },
        {
          name: '1 Positive Affirmation',
          durationSeconds: Math.min(25, stepTime),
          cue: 'reflect',
          instructions: 'Silently say to yourself: "I do not have to finish everything right now. I just need to take one step at a time."',
          tip: 'Take one last deep exhale.'
        }
      ];
    }
  },

  // ==========================================
  // 2. MOVEMENT
  // ==========================================
  {
    id: 'desk-stretch',
    title: 'Desk Stretch & Neck Tension Release',
    category: 'Movement',
    icon: '🧘',
    tagline: 'Relieve neck, shoulder, and back tightness caused by prolonged studying.',
    description: 'Targeted physical stretches designed specifically for students sitting at desks, boosting physical comfort and alertness.',
    targetDurations: [3, 5, 10, 15],
    getSteps: (durationMinutes) => {
      const stepTime = Math.floor((durationMinutes * 60) / 6);
      return [
        {
          name: 'Shoulder Rolls & Chest Open',
          durationSeconds: stepTime,
          cue: 'stretch',
          instructions: 'Roll your shoulders backwards in slow, wide circles 5 times, then forward 5 times. Interlace fingers behind your back and open your chest.',
          tip: 'Counteract the forward hunch from looking at screens and textbooks.'
        },
        {
          name: 'Gentle Neck Tilts',
          durationSeconds: stepTime,
          cue: 'stretch',
          instructions: 'Gently drop your right ear toward your right shoulder for a deep side stretch. Hold for a few breaths, then switch to the left side.',
          tip: 'Do not pull or force the neck; let gravity do the work.'
        },
        {
          name: 'Seated Spinal Twist',
          durationSeconds: stepTime,
          cue: 'stretch',
          instructions: 'Place your right hand on your left knee and gently twist your torso to the left. Hold for 3 breaths, then twist gently to the right.',
          tip: 'Keep your spine tall and breathe into your ribcage.'
        },
        {
          name: 'Wrist & Forearm Flex',
          durationSeconds: stepTime,
          cue: 'stretch',
          instructions: 'Extend your right arm forward with palm facing out. Gently pull fingers back with your left hand. Switch hands, then rotate wrists in circles.',
          tip: 'Essential relief after hours of typing or hand-written notes.'
        },
        {
          name: 'Seated Cat-Cow Spine Stretch',
          durationSeconds: stepTime,
          cue: 'stretch',
          instructions: 'Rest hands on knees. Inhale and arch your back, looking slightly upward (Cow). Exhale and round your spine, tucking your chin (Cat). Repeat 5 times.',
          tip: 'Synchronize the movement with smooth inhales and exhales.'
        },
        {
          name: 'Full Body Standing Reach',
          durationSeconds: stepTime,
          cue: 'stretch',
          instructions: 'Stand up, reach both arms straight up toward the ceiling, interlock your fingers, and take one big stretch while breathing in deeply.',
          tip: 'Shake your arms and legs gently as you lower your hands.'
        }
      ];
    }
  },

  {
    id: 'energy-shakeout',
    title: 'Physical Energy Boost & Posture Shakeout',
    category: 'Movement',
    icon: '⚡',
    tagline: 'Shake off lethargy and wake up your brain with blood-pumping micro-movement.',
    description: 'An active movement sequence to quickly shake out drowsiness, stimulate blood flow, and reset your energy levels.',
    targetDurations: [3, 5, 10],
    getSteps: (durationMinutes) => {
      const stepTime = Math.floor((durationMinutes * 60) / 5);
      return [
        {
          name: 'Stand Up & Shake It Out',
          durationSeconds: stepTime,
          cue: 'movement',
          instructions: 'Stand up from your desk. Shake your right hand, left hand, right leg, left leg vigorously for 10 seconds each.',
          tip: 'Release physical tension and wake up sleepy limbs.'
        },
        {
          name: 'High Knees or Step-in-Place',
          durationSeconds: stepTime,
          cue: 'movement',
          instructions: 'March in place, lifting your knees up toward your waist at a brisk, comfortable rhythm.',
          tip: 'Increases heart rate and oxygen delivery to the brain.'
        },
        {
          name: 'Arm Swings & Torso Twists',
          durationSeconds: stepTime,
          cue: 'movement',
          instructions: 'Stand with feet shoulder-width apart. Gently swing arms side to side, letting them wrap naturally around your torso as you pivot.',
          tip: 'Loosens the lower back and stimulates spinal circulation.'
        },
        {
          name: 'Deep Squats or Wall Sit',
          durationSeconds: stepTime,
          cue: 'movement',
          instructions: 'Perform 8 to 12 slow, controlled squats or hold a gentle wall sit to engage the large muscles in your legs.',
          tip: 'Engaging large muscle groups rapidly clears brain fog.'
        },
        {
          name: 'Hydration & Posture Lock-In',
          durationSeconds: stepTime,
          cue: 'finish',
          instructions: 'Take a sip of cool water. Stand tall with your spine aligned, take one deep breath, and prepare to sit down with renewed alertness.',
          tip: 'Dehydration is a leading hidden cause of student fatigue.'
        }
      ];
    }
  },

  // ==========================================
  // 3. REFLECTION
  // ==========================================
  {
    id: 'brain-dump',
    title: '5-Minute Cognitive Brain Dump',
    category: 'Reflection',
    icon: '📝',
    tagline: 'Offload racing thoughts and worry onto paper so your working memory is free.',
    description: 'When too many competing thoughts clog your mind, write everything down without filter to regain mental clarity.',
    targetDurations: [3, 5, 10, 15],
    getSteps: (durationMinutes) => {
      const stepTime = Math.floor((durationMinutes * 60) / 4);
      return [
        {
          name: 'Grab a Sheet or Open a Blank Doc',
          durationSeconds: Math.min(20, stepTime),
          cue: 'setup',
          instructions: 'Get a blank piece of paper and a pen (or open a temporary blank text document).',
          tip: 'Physical handwriting is often more cognitively relieving than typing.'
        },
        {
          name: 'Unfiltered Thought Discharge',
          durationSeconds: stepTime * 2,
          cue: 'write',
          instructions: 'Write down EVERY thought, worry, assignment, deadline, or random idea bouncing in your head. Do not edit, format, or organize—just get it out.',
          tip: 'If your mind says "I have too much to do", write that exact sentence down.'
        },
        {
          name: 'Sort: Controllable vs. Not Right Now',
          durationSeconds: stepTime,
          cue: 'organize',
          instructions: 'Scan your list. Circle 1 item you can take action on during your next study block. Draw a line through things you cannot control right this minute.',
          tip: 'You do not need to solve the whole semester today.'
        },
        {
          name: 'Set the Paper Aside',
          durationSeconds: Math.min(30, stepTime),
          cue: 'finish',
          instructions: 'Turn the paper face down or slide it to the side. Your brain can now rest knowing your thoughts are safely recorded.',
          tip: 'Your working memory is now clear to focus on just one single task.'
        }
      ];
    }
  },

  {
    id: 'perspective-reframe',
    title: 'Study Perspective & Reality Check',
    category: 'Reflection',
    icon: '🧭',
    tagline: 'Interrupt catastrophizing and reframe academic pressure with rational perspective.',
    description: 'A guided cognitive reflection to replace catastrophic thoughts with constructive next steps.',
    targetDurations: [3, 5, 10],
    getSteps: (durationMinutes) => {
      const stepTime = Math.floor((durationMinutes * 60) / 4);
      return [
        {
          name: 'Identify the Underlying Fear',
          durationSeconds: stepTime,
          cue: 'reflect',
          instructions: 'Ask yourself: "What specific story is my anxiety telling me right now?" (e.g., "If I don\'t understand this chapter, I will fail the exam").',
          tip: 'Naming the anxiety takes away its hidden power.'
        },
        {
          name: 'The Reality Check',
          durationSeconds: stepTime,
          cue: 'reflect',
          instructions: 'Ask yourself: "Is this catastrophic outcome 100% guaranteed? What is a more balanced, realistic view?"',
          tip: 'Even 20 minutes of imperfect studying improves your understanding.'
        },
        {
          name: 'Focus on Effort, Not Outcome',
          durationSeconds: stepTime,
          cue: 'reflect',
          instructions: 'Remind yourself: You cannot control the exam difficulty or future grades, but you CAN control the next 20 minutes of focused effort.',
          tip: 'Process-oriented goals always reduce performance anxiety.'
        },
        {
          name: 'One Actionable Step Forward',
          durationSeconds: stepTime,
          cue: 'finish',
          instructions: 'Select just ONE small section, paragraph, or problem you will work on next. Give yourself permission to do it imperfectly.',
          tip: 'Action creates motivation, not the other way around.'
        }
      ];
    }
  },

  // ==========================================
  // 4. PLANNING
  // ==========================================
  {
    id: 'priority-triage',
    title: '3-Priority Study Triage & Task Chunking',
    category: 'Planning',
    icon: '🎯',
    tagline: 'Break down an overwhelming mountain of study tasks into 3 manageable chunks.',
    description: 'Transform overwhelming assignment deadlines and exam materials into 3 concrete, sequential actions.',
    targetDurations: [3, 5, 10, 15],
    getSteps: (durationMinutes) => {
      const stepTime = Math.floor((durationMinutes * 60) / 4);
      return [
        {
          name: 'Identify Your #1 Non-Negotiable',
          durationSeconds: stepTime,
          cue: 'organize',
          instructions: 'If you could ONLY complete ONE task today to make the biggest academic impact, what is it? Write it down as Priority #1.',
          tip: 'Be specific: instead of "Study Biology", write "Review 5 flashcard decks on Cell Division".'
        },
        {
          name: 'Define Priority #2 and #3',
          durationSeconds: stepTime,
          cue: 'organize',
          instructions: 'Write down two secondary tasks that are helpful but not as urgent. Put a hard stop after these three.',
          tip: 'A 3-task list creates a clear finish line and prevents burnout.'
        },
        {
          name: 'Micro-Chunk Priority #1',
          durationSeconds: stepTime,
          cue: 'organize',
          instructions: 'Break Priority #1 into the very first 5-minute action (e.g., "Open textbook to page 42 and read 1 summary box").',
          tip: 'Shrink the starting friction until it feels almost too easy to fail.'
        },
        {
          name: 'Commit to the First 20 Minutes',
          durationSeconds: stepTime,
          cue: 'finish',
          instructions: 'Decide that for your next study block, you will only look at Priority #1. Hide all other notebooks and tabs.',
          tip: 'Single-tasking is 50% faster than frantic multitasking.'
        }
      ];
    }
  },

  // ==========================================
  // 5. QUICK STUDY RESET
  // ==========================================
  {
    id: 'desk-clear-restart',
    title: '2-Minute Desk Clear & Mental Wipe',
    category: 'Quick study reset',
    icon: '🧹',
    tagline: 'Declutter your physical study surface and close distracting browser tabs.',
    description: 'Visual clutter creates subconscious cognitive load. A clean workspace signals a fresh start to your brain.',
    targetDurations: [3, 5, 10],
    getSteps: (durationMinutes) => {
      const stepTime = Math.floor((durationMinutes * 60) / 4);
      return [
        {
          name: 'Physical Desk Sweep',
          durationSeconds: stepTime,
          cue: 'organize',
          instructions: 'Remove empty cups, plates, wrappers, and irrelevant papers from your study desk. Keep ONLY the tools needed for your current task.',
          tip: 'A clean field of vision immediately reduces subconscious distraction.'
        },
        {
          name: 'Digital Tab & Notification Purge',
          durationSeconds: stepTime,
          cue: 'organize',
          instructions: 'Close or bookmark all open browser tabs not related to your immediate task. Turn phone to "Do Not Disturb" and place it face down.',
          tip: 'Every open tab is an open cognitive loop in your brain.'
        },
        {
          name: 'Prepare Your Study Fuel',
          durationSeconds: stepTime,
          cue: 'organize',
          instructions: 'Fill up your water glass. Check your lighting and adjust your chair height for optimal ergonomics.',
          tip: 'Physical comfort directly influences study endurance.'
        },
        {
          name: 'Take 3 Deep Intentional Breaths',
          durationSeconds: stepTime,
          cue: 'finish',
          instructions: 'Sit down, place your hands on your keyboard or notes, inhale deeply, and declare: "This is a fresh session. I am starting clean."',
          tip: 'Begin your study timer as soon as you feel ready.'
        }
      ];
    }
  }
];

/**
 * Helper to get activity by ID
 */
export function getActivityById(id) {
  return ACTIVITIES.find(a => a.id === id) || ACTIVITIES[0];
}
