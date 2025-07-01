// Glow OS Habit and Mood Data
const defaultHabits = {
  "glow-up-habits": [
    "Brush teeth",
    "Wash face with soap",
    "Posture exercises",
    "Drink 2L of water",
    "Tape mouth before sleeping (شريط لاصق)",
    "Sleep at 10 PM",
    "Wake up at 6 AM",
    "Change pillows weekly",
    "Apply sunscreen",
    "Moisturize face/body",
    "Hair care (brush, oil, etc.)",
    "Feminine walking/posture",
    "Skincare routine (AM + PM)"
  ],
  "religion-habits": [
    "Pray 5 prayers",
    "Read Qur’an",
    "Make Du’a & Dhikr",
    "Reflect on one Ayah",
    "Listen to a religious lecture",
    "Pray Tahajjud",
    "Read Surah Al-Kahf (Friday)",
    "Practice patience & kindness",
    "Do a secret good deed"
  ],
  "career-habits": [
    "Send 10 DMs to potential clients",
    "Apply to 3 jobs",
    "Update CV or portfolio",
    "Work on 1 freelance task",
    "Improve 1 section of your website",
    "Research clients/niches",
    "Make 1 proposal or gig post",
    "Build or fix one project feature"
  ],
  "brain-habits": [
    "Learn chess (practice 10 min)",
    "Learn French (Duolingo/video)",
    "Learn English (reading/listening)",
    "Read 1 chapter of a book",
    "Learn Adobe Photoshop",
    "Watch educational content (doc/tutorial)",
    "Take personal notes (digital or paper)"
  ],
  "content-habits": [
    "Post daily on Instagram",
    "Post daily on TikTok",
    "Edit 5 TikToks and save to drafts",
    "Write down a new content idea",
    "Engage with 3 comments or DMs",
    "Schedule one post",
    "Review analytics for improvement"
  ],
  "lifestyle-habits": [
    "Organize room",
    "Declutter 1 item",
    "Help mom",
    "Do laundry",
    "Wipe surfaces",
    "Vacuum or sweep",
    "Plan your meals/snacks",
    "Clean your phone/screens"
  ],
  "mindset-habits": [
    "Write 1 gratitude point",
    "Say something kind to yourself",
    "Avoid complaining",
    "Smile intentionally 3x",
    "Track your mood",
    "Journal (short version)",
    "Limit phone scrolling to 1h/day",
    "Drink something warm and relax"
  ]
};

function loadHabits() {
  let habits = {};
  try {
    habits = JSON.parse(localStorage.getItem('glowos-habits')) || {};
  } catch { habits = {}; }
  // Fill missing themes with defaults
  Object.keys(defaultHabits).forEach(theme => {
    if (!Array.isArray(habits[theme])) habits[theme] = [...defaultHabits[theme]];
  });
  return habits;
}
function saveHabits(habits) {
  localStorage.setItem('glowos-habits', JSON.stringify(habits));
}
let habits = loadHabits();

// --- Utilities ---
function getTodayKey() {
  const now = new Date();
  return now.toISOString().slice(0, 10); // yyyy-mm-dd
}
function getWeekKeys() {
  const now = new Date();
  const week = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    week.push(d.toISOString().slice(0, 10));
  }
  return week;
}

// --- Motivational Quotes ---
const quotes = [
  "Small steps every day lead to big changes.",
  "You are glowing and growing, even on slow days.",
  "Discipline is self-love in action.",
  "Your future self will thank you.",
  "Progress, not perfection.",
  "Gentle routines, radiant results.",
  "Shine from within, glow on the outside.",
  "Consistency is your superpower.",
  "Kindness to yourself is a daily habit.",
  "Every day is a fresh start to glow."
];

function getQuoteOfDay() {
  // Use date to pick a quote
  const today = new Date();
  const idx = (today.getFullYear() + today.getMonth() + today.getDate()) % quotes.length;
  return quotes[idx];
}

// --- Journal Prompts ---
const prompts = [
  "What did you learn today?",
  "How did you show kindness to yourself?",
  "What are you grateful for right now?",
  "Describe a small win from today.",
  "How did you handle a challenge today?",
  "What made you smile today?",
  "What will you do differently tomorrow?"
];
function getPromptOfDay() {
  const today = new Date();
  const idx = (today.getFullYear() + today.getMonth() + today.getDate()) % prompts.length;
  return prompts[idx];
}

// --- Progress Flower SVG ---
function renderFlower(percent) {
  // 6 petals, grow opacity/size as percent increases
  const petals = 6;
  const filled = Math.round(percent * petals);
  let svg = `<svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">`;
  for (let i = 0; i < petals; i++) {
    const angle = (i / petals) * 2 * Math.PI;
    const r = 18 + (i < filled ? 9 : 0);
    const cx = 30 + Math.cos(angle) * r;
    const cy = 30 + Math.sin(angle) * r;
    svg += `<ellipse cx="${cx}" cy="${cy}" rx="10" ry="18" fill="#ffe4ec" opacity="${i < filled ? 0.95 : 0.28}" transform="rotate(${angle * 180 / Math.PI},${cx},${cy})"/>`;
  }
  svg += `<circle cx="30" cy="30" r="11" fill="#e07ea8" stroke="#fffbe6" stroke-width="3"/>`;
  svg += `</svg>`;
  return svg;
}

// --- Progress/History ---
function getHabitCompletionToday() {
  let total = 0, checked = 0;
  Object.entries(habits).forEach(([sectionId, habitList]) => {
    habitList.forEach((_, idx) => {
      total++;
      const habitId = `${sectionId}-habit-${idx}`;
      if (localStorage.getItem(habitId) === 'true') checked++;
    });
  });
  return {checked, total, percent: total ? checked / total : 0};
}
function saveTodayProgress() {
  const {checked, total} = getHabitCompletionToday();
  localStorage.setItem('glowos-progress-' + getTodayKey(), JSON.stringify({checked, total}));
}
function getHistoryWeek() {
  const week = getWeekKeys();
  return week.map(day => {
    const data = localStorage.getItem('glowos-progress-' + day);
    if (!data) return 0;
    const {checked, total} = JSON.parse(data);
    return total && checked === total ? 1 : checked > 0 ? 0.5 : 0;
  });
}

// --- DOMContentLoaded ---
document.addEventListener('DOMContentLoaded', () => {
  // Render all editable habit lists
  Object.entries(habits).forEach(([sectionId, habitList]) => {
    renderHabitList(sectionId);
  });

  function renderHabitList(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return;
    section.innerHTML = '';
    const list = habits[sectionId];
    list.forEach((habit, idx) => {
      const habitId = `${sectionId}-habit-${idx}`;
      const isChecked = localStorage.getItem(habitId) === 'true';
      const box = document.createElement('div');
      box.className = 'habit-box' + (isChecked ? ' completed' : '');
      // Editable row state
      if (habit && habit.__editing) {
        box.innerHTML = `
          <input type="text" class="habit-edit-input" value="${habit.text || habit}" maxlength="50">
          <button class="habit-edit-save">Save</button>
        `;
        const input = box.querySelector('input');
        const saveBtn = box.querySelector('.habit-edit-save');
        saveBtn.onclick = () => {
          const val = input.value.trim();
          if (val) {
            habits[sectionId][idx] = val;
            saveHabits(habits);
            renderHabitList(sectionId);
            updateProgress();
          }
        };
        input.addEventListener('keydown', e => { if (e.key === 'Enter') saveBtn.click(); });
        section.appendChild(box);
        return;
      }
      // Normal row
      box.innerHTML = `
        <input type="checkbox" class="habit-checkbox" id="${habitId}" ${isChecked ? 'checked' : ''}>
        <span class="habit-label">${typeof habit === 'string' ? habit : habit.text}</span>
        <div class="habit-actions">
          <button class="habit-btn habit-edit" title="Edit">🖊️</button>
          <button class="habit-btn habit-delete" title="Delete">🗑️</button>
        </div>
      `;
      // Checkbox event
      const checkbox = box.querySelector('input[type="checkbox"]');
      checkbox.addEventListener('change', (e) => {
        if (checkbox.checked) box.classList.add('completed');
        else box.classList.remove('completed');
        localStorage.setItem(habitId, checkbox.checked);
        updateProgress();
      });
      // Edit event
      box.querySelector('.habit-edit').onclick = () => {
        habits[sectionId][idx] = {text: typeof habit === 'string' ? habit : habit.text, __editing: true};
        renderHabitList(sectionId);
      };
      // Delete event
      box.querySelector('.habit-delete').onclick = () => {
        habits[sectionId].splice(idx, 1);
        saveHabits(habits);
        // Remove checkbox state for this habit
        localStorage.removeItem(habitId);
        renderHabitList(sectionId);
        updateProgress();
      };
      section.appendChild(box);
    });
    // Add Habit Row
    const addRow = document.createElement('div');
    addRow.className = 'add-habit-row';
    addRow.style.marginTop = '0.3em';
    addRow.innerHTML = `
      <button class="add-habit-trigger">➕ Add Habit</button>
    `;
    addRow.querySelector('.add-habit-trigger').onclick = () => {
      addRow.innerHTML = `
        <input type="text" class="add-habit-input" maxlength="50" placeholder="New habit...">
        <button class="add-habit-btn">Add</button>
      `;
      const input = addRow.querySelector('input');
      const addBtn = addRow.querySelector('button');
      addBtn.onclick = () => {
        const val = input.value.trim();
        if (val) {
          habits[sectionId].push(val);
          saveHabits(habits);
          renderHabitList(sectionId);
          updateProgress();
        }
      };
      input.addEventListener('keydown', e => { if (e.key === 'Enter') addBtn.click(); });
      input.focus();
    };
    section.appendChild(addRow);
  }


  // Mood tracker
  const moodBtns = document.querySelectorAll('.mood-btn');
  const savedMood = localStorage.getItem('glowos-mood');
  function setMoodBg(mood) {
    let bg;
    if (mood === 'happy') bg = getComputedStyle(document.documentElement).getPropertyValue('--bg-happy');
    else if (mood === 'neutral') bg = getComputedStyle(document.documentElement).getPropertyValue('--bg-neutral');
    else if (mood === 'sad') bg = getComputedStyle(document.documentElement).getPropertyValue('--bg-sad');
    else bg = getComputedStyle(document.documentElement).getPropertyValue('--bg-happy');
    document.body.style.setProperty('--bg-gradient', bg);
  }
  if (savedMood) {
    moodBtns.forEach(btn => {
      if (btn.dataset.mood === savedMood) btn.classList.add('selected');
    });
    setMoodBg(savedMood);
  } else {
    setMoodBg('happy');
  }
  moodBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      moodBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      localStorage.setItem('glowos-mood', btn.dataset.mood);
      setMoodBg(btn.dataset.mood);
    });
  });
});
