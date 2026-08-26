# CalmPath AI — AI-Powered Student Wellbeing & Study-Support

CalmPath AI is an educational study-support and student wellbeing application. It learns which short wellbeing and study strategies work best for each student to regulate cognitive overload, relieve academic stress, and refocus on coursework.

---

## 🌟 Key Differentiator: Learning From Feedback

Unlike generic chatbots or one-size-fits-all mindfulness apps, CalmPath AI closes the loop with **personal self-reported outcome tracking**:

```
Student Check-in (Stress, Focus, Energy, Reason, Workload)
         ↓
AI & Personalization Engine (Analyzes state + historical effectiveness)
         ↓
Personalized Reset (Targeted micro-intervention 3–15 min)
         ↓
Student Completes Reset & Enters Post-Feedback
         ↓
Personal Profile Updated ("What Works For Me" analytics)
         ↓
Smarter Future Recommendations & Adaptive Study Plans
```

---

## ⚡ Real AI & Google Gemini Integration

CalmPath AI integrates with **Google Gemini 1.5 Flash / 2.0 Flash** with a **zero-failure architecture**:

- **Structured Output**: Strict JSON schemas for activity steps, allocated seconds, animation cues, and next immediate study actions.
- **Strict Non-Diagnostic Safety**: System prompt enforces student-focused wellbeing and study organization boundaries without medical claims.
- **Zero-Failure Fallback Engine**: If no API key is provided, or if the student is offline, CalmPath AI automatically switches to the **Local Personalization Engine** which weights recommendations using the student's historical focus gains and stress drops.

### How to Configure Google Gemini (Optional):
1. Click the **"⚡ AI Settings"** button in the top navigation bar.
2. Enter your **Google Gemini API Key** (`AIzaSy...`).
3. Click **"Save Settings"**. Your key is saved locally in browser storage and is never exposed or shared.

---

## 🎯 AI Adaptive Study Plan Generator

CalmPath AI analyzes:
- Current self-reported stress, focus, and energy
- Active assignments and upcoming deadlines
- Historical recovery pacing

It then generates a balanced, Pomodoro-style schedule with built-in micro-resets (e.g. 5m Reset $\rightarrow$ 25m Focused Study $\rightarrow$ 5m Restorative Break $\rightarrow$ 20m Secondary Task) to avoid cognitive fatigue and prevent all-nighters.

Access it anytime via the **"🎯 Study Plan"** link in the top navigation or mobile bottom bar.

---

## 📂 Project Architecture

```
Hackton/
├── index.html                  # Responsive HTML5 shell, navigation & modals
├── README.md                   # System documentation & setup guide
├── css/
│   └── styles.css              # Custom range sliders, SVG timer animations & glassmorphism
└── js/
    ├── app.js                  # Main controller & view/modal router
    ├── state/
    │   └── store.js            # Central state store, AI status & localStorage persistence
    ├── logic/
    │   ├── activities.js       # Curated activity catalog & fallback templates
    │   ├── aiService.js        # Google Gemini API client with schema validation & prompt engineering
    │   ├── audio.js            # Web Audio API mindfulness bell synthesizer
    │   ├── feedbackAnalysis.js # Before/After delta calculation & observation generator
    │   ├── personalization.js  # "What Works For Me" historical delta analytics engine
    │   ├── recommendations.js  # Recommendation orchestrator (Gemini AI + Fallback)
    │   └── studyPlanService.js # AI-powered adaptive study plan generator
    ├── views/
    │   ├── homeView.js         # Dashboard with proactive workload insights & 5-minute rescue
    │   ├── checkinView.js      # 4-step progressive check-in with custom sliders
    │   ├── recommendationView.js # AI recommendation card with next study action
    │   ├── activityView.js     # SVG circular timer, breathing visualizer & audio chime
    │   ├── feedbackView.js     # Post-reset self-assessment sliders
    │   ├── resultsView.js      # Reset summary & celebration screen
    │   ├── aiSettingsModal.js  # Gemini API key configuration modal
    │   ├── patternsModal.js    # "What Works For Me" category effectiveness breakdown
    │   ├── studyLoadModal.js   # Study task queue manager
    │   └── studyPlanModal.js   # Adaptive study schedule timeline modal
    └── utils/
        ├── helpers.js          # Time formatters, slider styling & descriptors
        └── storage.js          # Safe localStorage wrapper
```

---

## 🚀 How to Run the Application

The application requires **zero setup, zero build steps, and no package installation**:

1. Double click **[`index.html`](file:///c:/Users/Admin/Desktop/Hackton/index.html)** in the `Hackton` folder or open it in any modern browser.
2. (Optional) Run with any local server:
   ```bash
   python -m http.server 3000
   ```
   and visit `http://localhost:3000`.

---

## 🧪 Testing Scenarios

1. **High Stress / Acute Overload**: Click *"Start 5-Minute Rescue"* on the Dashboard for immediate 1-click rescue.
2. **Custom Check-in**: Use the 4-step wizard with custom sliders for stress, focus, and energy.
3. **Adaptive Study Plan**: Click *"🎯 Study Plan"* in the top navigation or banner to generate a paced study schedule.
4. **Learning Loop**: Complete 2-3 resets and open *"📊 My Patterns"* to inspect your personalized category effectiveness breakdown.
5. **AI Settings**: Click *"⚡ AI Settings"* to toggle between Google Gemini API and Local Personalization.
