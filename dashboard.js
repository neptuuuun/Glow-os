// Glow OS — 24h Glow Circle Dashboard
// Vanilla JS, no frameworks

const CIRCLE_MINUTES = 1440;
const DEFAULT_TASKS = [
  // ✨ Glow Up
  { group: 'Glow Up', name: "Brush teeth", minutes: 2 },
  { group: 'Glow Up', name: "Wash face with soap", minutes: 3 },
  { group: 'Glow Up', name: "Drink 2L of water", minutes: 10 },
  { group: 'Glow Up', name: "Tape mouth before sleeping", minutes: 1 },
  { group: 'Glow Up', name: "Sleep", minutes: 480 },
  { group: 'Glow Up', name: "Moisturize face/body", minutes: 3 },
  { group: 'Glow Up', name: "Hair care", minutes: 5 },
  { group: 'Glow Up', name: "Feminine walking/posture", minutes: 10 },
  { group: 'Glow Up', name: "Skincare routine (AM + PM)", minutes: 10 },
  // 🕋 Religion
  { group: 'Religion', name: "Pray 5 prayers", minutes: 50 },
  { group: 'Religion', name: "Read Qur’an", minutes: 15 },
  { group: 'Religion', name: "Make Du’a & Dhikr", minutes: 10 },
  { group: 'Religion', name: "Reflect on one Ayah", minutes: 5 },
  { group: 'Religion', name: "Listen to religious lecture", minutes: 20 },
  { group: 'Religion', name: "Pray Tahajjud", minutes: 20 },
  // 💻 Freelance / Career
  { group: 'Freelance / Career', name: "Send 10 DMs to clients", minutes: 30 },
  { group: 'Freelance / Career', name: "Work on 1 freelance task", minutes: 60 },
  { group: 'Freelance / Career', name: "Research clients/niches", minutes: 20 },
  // 🧠 Brain Glow-Up
  { group: 'Brain Glow-Up', name: "Learn chess", minutes: 10 },
  { group: 'Brain Glow-Up', name: "Learn French", minutes: 30 },
  { group: 'Brain Glow-Up', name: "Learn English", minutes: 30 },
  { group: 'Brain Glow-Up', name: "Read 1 book chapter", minutes: 20 },
  { group: 'Brain Glow-Up', name: "Learn Photoshop", minutes: 30 },
  { group: 'Brain Glow-Up', name: "Watch a documentary", minutes: 30 },
  { group: 'Brain Glow-Up', name: "Take personal notes", minutes: 15 },
  // 🎨 Content Creation
  { group: 'Content Creation', name: "Post on Instagram", minutes: 15 },
  { group: 'Content Creation', name: "Post on TikTok", minutes: 15 },
  { group: 'Content Creation', name: "Edit 5 TikToks", minutes: 60 },
  { group: 'Content Creation', name: "Write new content idea", minutes: 5 },,
  // 🧼 Lifestyle / Home
  { group: 'Lifestyle / Home', name: "Organize room", minutes: 15 },
  { group: 'Lifestyle / Home', name: "Help mom", minutes: 20 },
  // 💗 Glow Mindset / Self-Love
  { group: 'Glow Mindset / Self-Love', name: "Write 1 gratitude point", minutes: 5 },
  { group: 'Glow Mindset / Self-Love', name: "Say something kind to yourself", minutes: 2 },
  { group: 'Glow Mindset / Self-Love', name: "Avoid complaining", minutes: 1 },
  { group: 'Glow Mindset / Self-Love', name: "Smile intentionally 3x", minutes: 1 },
  { group: 'Glow Mindset / Self-Love', name: "Track your mood", minutes: 3 },
  { group: 'Glow Mindset / Self-Love', name: "Journal", minutes: 15 },
  { group: 'Glow Mindset / Self-Love', name: "Limit phone use < 1h", minutes: 60 },
];


function loadTasks() {
  const data = localStorage.getItem('glowos-tasks');
  if (!data) {
    // Add done:false to all default tasks if missing
    return DEFAULT_TASKS.map(t => ({...t, done: false}));
  }
  try {
    return JSON.parse(data);
  } catch {
    return DEFAULT_TASKS.map(t => ({...t, done: false}));
  }
} 

function saveTasks(tasks) {
  localStorage.setItem('glowos-tasks', JSON.stringify(tasks));
}

function minutesToHM(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h > 0 ? h + 'h ' : ''}${m > 0 ? m + 'min' : ''}`.trim() || '0min';
}

function renderTaskTable(tasks) {
  const tbody = document.getElementById('task-list');
  tbody.innerHTML = '';
  // Group tasks by group property
  const groups = {};
  tasks.forEach((task, i) => {
    if (!groups[task.group]) groups[task.group] = [];
    groups[task.group].push({ ...task, _idx: i });
  });
  Object.keys(groups).forEach(groupName => {
    // Group header row
    const groupTr = document.createElement('tr');
    const groupTd = document.createElement('td');
    groupTd.colSpan = 4;
    groupTd.textContent = groupName;
    groupTd.className = 'task-group-header';
    groupTr.appendChild(groupTd);
    tbody.appendChild(groupTr);
    // Tasks in this group
    groups[groupName].forEach((task, i) => {
      const tr = document.createElement('tr');
      // Checkbox
      const tdCheck = document.createElement('td');
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.checked = !!task.done;
      cb.className = 'task-done-checkbox';
      cb.addEventListener('change', () => {
        tasks[task._idx].done = cb.checked;
        saveTasks(tasks);
        renderAll(tasks);
      });
      tdCheck.appendChild(cb);
      tr.appendChild(tdCheck);
      // Name
      const tdName = document.createElement('td');
      const nameInput = document.createElement('input');
      nameInput.type = 'text';
      nameInput.value = task.name;
      nameInput.className = 'task-name-input';
      nameInput.addEventListener('change', () => {
        tasks[task._idx].name = nameInput.value;
        saveTasks(tasks);
        renderAll(tasks);
      });
      tdName.appendChild(nameInput);
      tr.appendChild(tdName);
      // Duration
      const tdDuration = document.createElement('td');
      const durationInput = document.createElement('input');
      durationInput.type = 'number';
      durationInput.min = 1;
      durationInput.max = 1440;
      durationInput.value = task.minutes;
      durationInput.className = 'task-duration-input';
      durationInput.addEventListener('change', () => {
        let val = parseInt(durationInput.value, 10);
        if (isNaN(val) || val < 1) val = 1;
        if (val > 1440) val = 1440;
        tasks[task._idx].minutes = val;
        durationInput.value = val;
        saveTasks(tasks);
        renderAll(tasks);
      });
      tdDuration.appendChild(durationInput);
      tr.appendChild(tdDuration);
      // Delete
      const tdDelete = document.createElement('td');
      const delBtn = document.createElement('button');
      delBtn.innerText = '✕';
      delBtn.className = 'task-delete-btn';
      delBtn.addEventListener('click', () => {
        tasks.splice(task._idx, 1);
        saveTasks(tasks);
        renderAll(tasks);
      });
      tdDelete.appendChild(delBtn);
      tr.appendChild(tdDelete);
      tbody.appendChild(tr);
    });
  });
}


function renderAll(tasks) {
  renderTaskTable(tasks);
  renderCircle(tasks);
  renderTaskFooter(tasks);
}


function renderTaskFooter(tasks) {
  const total = tasks.reduce((sum, t) => sum + t.minutes, 0);
  const left = CIRCLE_MINUTES - total;
  document.getElementById('total-time').textContent = `Total: ${minutesToHM(total)} / 24h`;
  if (left < 0) {
    document.getElementById('circle-warning').textContent = "You're overbooking your day ☁️";
    document.getElementById('circle-warning').style.display = 'block';
  } else {
    document.getElementById('circle-warning').style.display = 'none';
  }
  document.getElementById('circle-time-left').textContent = left >= 0 ? minutesToHM(left) + ' left' : 'Overbooked!';
}

function renderCircle(tasks) {
  const svg = document.getElementById('glow-circle');
  svg.innerHTML = '';
  let angle = 0;
  const total = tasks.reduce((sum, t) => sum + t.minutes, 0);
  const radius = 130;
  const cx = 160, cy = 160;
  // Pastel palette
  const palette = [
    '#ffd1e3', '#ffe3fa', '#ffe4ec', '#c3b3f7', '#f7d6e0', '#f7e3c3', '#c3f7e1', '#e3f7c3', '#f7c3e3', '#f7c3c3'
  ];
  tasks.forEach((task, i) => {
    const portion = task.minutes / CIRCLE_MINUTES;
    const sweep = portion * 360;
    const largeArc = sweep > 180 ? 1 : 0;
    const endAngle = angle + sweep;
    const startRad = (angle - 90) * Math.PI / 180;
    const endRad = (endAngle - 90) * Math.PI / 180;
    const x1 = cx + radius * Math.cos(startRad);
    const y1 = cy + radius * Math.sin(startRad);
    const x2 = cx + radius * Math.cos(endRad);
    const y2 = cy + radius * Math.sin(endRad);
    const path = `M${cx},${cy} L${x1},${y1} A${radius},${radius} 0 ${largeArc},1 ${x2},${y2} Z`;
    const seg = document.createElementNS('http://www.w3.org/2000/svg','path');
    seg.setAttribute('d', path);
    seg.setAttribute('fill', palette[i % palette.length]);
    seg.setAttribute('opacity', task.done ? '0.35' : '1');
    seg.setAttribute('stroke', '#fff');
    seg.setAttribute('stroke-width', '2');
    svg.appendChild(seg);
    angle += sweep;
  });
}

function addTask(tasks) {
  // Default to first group or 'Glow Up'
  const firstGroup = tasks.length ? tasks[0].group : 'Glow Up';
  tasks.push({ group: firstGroup, name: 'New Task', minutes: 30, done: false });
  saveTasks(tasks);
  renderAll(tasks);
}

function resetTasks() {
  localStorage.removeItem('glowos-tasks');
  location.reload();
}

document.addEventListener('DOMContentLoaded', () => {
  let tasks = loadTasks();
  renderAll(tasks);

  document.getElementById('add-task-btn').addEventListener('click', () => {
    addTask(tasks);
  });
  document.getElementById('reset-btn').addEventListener('click', resetTasks);
});
