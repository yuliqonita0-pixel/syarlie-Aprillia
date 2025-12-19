/* =====================
   AUTH GUARD
===================== */
(function () {
  const publicPages = ["login.html"];
  const current = window.location.pathname.split("/").pop();
  if (!publicPages.includes(current)) {
    if (localStorage.getItem("loggedIn") !== "true") {
      window.location.href = "login.html";
    }
  }
})();

function register(username, password) {
  if (!username || !password) return alert("Semua kolom harus diisi!");
  if (localStorage.getItem("user_" + username)) return alert("Username sudah ada!");

  localStorage.setItem("user_" + username, JSON.stringify({ username, password }));
  alert("Akun berhasil dibuat!");
  window.location.href = "login.html";
}

function login(username, password) {
  const data = localStorage.getItem("user_" + username);
  if (!data) return alert("Akun tidak ditemukan!");
  const user = JSON.parse(data);

  if (user.password !== password) return alert("Password salah!");

  localStorage.setItem("loggedIn", "true");
  localStorage.setItem("currentUser", username);
  window.location.href = "index.html";
}

function logout() {
  localStorage.removeItem("loggedIn");
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}

(function () {
  const VERSION = "planner_template_v10";
  if (localStorage.getItem("template_version") !== VERSION) {
    localStorage.removeItem("planner_clean_v1");
    localStorage.setItem("template_version", VERSION);
  }
})();

const DEFAULT_TEMPLATES = [
  { id: "daily", title: "Daily Routine", group: "planner", color: "#7b66e6", icon: "📝", desc: "Jadwal harian" },
  { id: "diary", title: "Diary", group: "planner", color: "#ff9a9a", icon: "📔", desc: "Catatan harian" },
  { id: "shopping", title: "Shopping List", group: "planner", color: "#4db6ff", icon: "🛒", desc: "Daftar belanja" },
  { id: "task", title: "Task List", group: "planner", color: "#ffd36b", icon: "📌", desc: "Tugas prioritas" },

  { id: "habit", title: "Habit Tracker", group: "trackers", color: "#7b66e6", icon: "📊", desc: "Kebiasaan harian" },
  { id: "goal", title: "Goal Tracker", group: "trackers", color: "#ffd36b", icon: "🏆", desc: "Pantau tujuan" },
  { id: "finance", title: "Finance Tracker", group: "trackers", color: "#4db6ff", icon: "💰", desc: "Keuangan harian" },
  { id: "sketsa", title: "Sketsa", group: "trackers", color: "#9ad0f5", icon: "🖌️", desc: "Membuat sketsa" }
];

const PAGE_MAP = {
  daily: "pages/daily-routine.html",
  diary: "pages/diary.html",
  shopping: "pages/shopping.html",
  task: "pages/tasklist.html",
  habit: "pages/habit-tracker.html",
  goal: "pages/goal-tracker.html",
  finance: "pages/finance.html",
  sketsa: "pages/sketsa.html"
};


function lighten(hex, pct) {
  const c = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, (c >> 16) + (255 * pct) / 100);
  const g = Math.min(255, ((c >> 8) & 255) + (255 * pct) / 100);
  const b = Math.min(255, (c & 255) + (255 * pct) / 100);
  return `rgb(${r},${g},${b})`;
}


const STORAGE_KEY = "planner_clean_v1";
let state = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");

state.templates = DEFAULT_TEMPLATES.slice();
state.order = DEFAULT_TEMPLATES.map(t => t.id);


function createCard(t) {
  const el = document.createElement("div");
  el.className = "card";

 
  el.dataset.search = `${t.title} ${t.desc}`.toLowerCase();

  el.innerHTML = `
    <div class="icon" style="background:linear-gradient(135deg,${lighten(t.color, 30)},${t.color})">${t.icon}</div>
    <div>
      <div class="label">${t.title}</div>
      <div class="sub">${t.desc}</div>
    </div>
  `;

  el.onclick = () => {
    if (PAGE_MAP[t.id]) window.location.href = PAGE_MAP[t.id];
  };

  return el;
}

const menuGrids = {
  planner: "menuGrid",
  trackers: "menuGrid2"
};

function render() {
  Object.values(menuGrids).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = "";
  });

  state.order.forEach(id => {
    const t = state.templates.find(x => x.id === id);
    if (!t) return;

    const target = document.getElementById(menuGrids[t.group]);
    if (target) target.appendChild(createCard(t));
  });

  saveState();
}

render();

const searchInput = document.getElementById("search");

if (searchInput) {
  searchInput.addEventListener("input", () => {
    const q = searchInput.value.toLowerCase().trim();

    document.querySelectorAll(".card").forEach(card => {
      card.style.display = card.dataset.search.includes(q)
        ? ""
        : "none";
    });
  });
}
function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
