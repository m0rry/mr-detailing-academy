// MR Detailing Academy — app.js (FULL, WORKING)
// - Admin-only full access (by Telegram user id)
// - Regular users: free course open, paid locked
// - Courses -> Modules -> Lesson -> Test -> Pass/Fail + progress
// - Stores progress in localStorage

const tg = window.Telegram?.WebApp;
const $ = (q) => document.querySelector(q);
const $$ = (q) => Array.from(document.querySelectorAll(q));

/* =========================
   ADMIN ACCESS (IMPORTANT)
   =========================
   1) Get your Telegram ID via @userinfobot
   2) Replace YOUR_TELEGRAM_ID_HERE below with digits (example: 123456789)
*/
const ADMIN_TG_IDS = new Set([
  340616352, // <-- CHANGE THIS
]);

function getTelegramUserId() {
  const u = tg?.initDataUnsafe?.user;
  return u?.id ? Number(u.id) : null;
}
function isAdmin() {
  const id = getTelegramUserId();
  return id != null && ADMIN_TG_IDS.has(id);
}

/* ---------- helpers ---------- */
function safeSetText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function popup(title, message) {
  if (tg?.showPopup) {
    tg.showPopup({ title, message, buttons: [{ type: "ok" }] });
  } else {
    alert(`${title}\n\n${message}`);
  }
}

function nowGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Доброе утро,";
  if (h < 18) return "Добрый день,";
  return "Добрый вечер,";
}

function fmtPct(n) {
  const v = Math.max(0, Math.min(100, Number(n) || 0));
  return `${v}%`;
}

/* ---------- state ---------- */
const state = {
  tab: "home",
  user: { id: "local", name: "User" },
  progress: JSON.parse(localStorage.getItem("mr_progress") || "{}"),
};

function saveProgress() {
  localStorage.setItem("mr_progress", JSON.stringify(state.progress));
}
function setProgress(key, value) {
  state.progress[key] = value;
  saveProgress();
}
function getProgress(key) {
  return !!state.progress[key];
}

/* ---------- academy data (MVP) ---------- */
const academy = {
  courses: [
    {
      id: "wash",
      title: "Курс мойки",
      desc: "Обязательная база. Откроет доступ к остальному обучению.",
      free: true,
      modules: [
        {
          id: "wash_m1",
          title: "Модуль 1 — Основы",
          lessons: [
            {
              id: "wash_l1",
              title: "Что такое детейлинг",
              text:
`Детейлинг — это системный уход за автомобилем: очистка + восстановление + защита.

Цель: не “быстро помыть”, а делать стабильный результат и сохранять покрытие.`,
              test: {
                q: "Детейлинг — это…",
                options: [
                  "Просто мойка с пеной",
                  "Системный уход: очистка + восстановление + защита",
                  "Только полировка кузова",
                ],
                correctIndex: 1,
                explain: "Детейлинг включает очистку, восстановление и защиту.",
              },
            },
            {
              id: "wash_l2",
              title: "Ошибки новичков",
              text:
`Топ ошибок:
1) Одна губка на всё → микроцарапины
2) Мойка по сухой пыли
3) Сильная химия без контроля
4) Плохая сушка → разводы/камень`,
              test: {
                q: "Что чаще всего вызывает микроцарапины?",
                options: [
                  "Одна губка/тряпка на всё",
                  "Раздельные ведра и микрофибры",
                  "Сушка воздухом",
                ],
                correctIndex: 0,
                explain: "Одна губка собирает абразив и царапает ЛКП.",
              },
            },
          ],
        },
        {
          id: "wash_m2",
          title: "Модуль 2 — Процесс",
          lessons: [
            {
              id: "wash_l3",
              title: "Двухфазная мойка",
              text:
`Фаза 1: бесконтакт — снимает основную грязь.
Фаза 2: контакт — безопасно домывает.

Правило: контакт только после бесконтакта.`,
              test: {
                q: "Зачем нужна первая фаза?",
                options: [
                  "Чтобы снять грязь и снизить риск царапин",
                  "Чтобы высушить кузов",
                  "Чтобы быстрее перейти к контакту",
                ],
                correctIndex: 0,
                explain: "Фаза 1 снимает грязь — меньше абразива при контакте.",
              },
            },
          ],
        },
      ],
    },
    {
      id: "interior",
      title: "Химчистка салона",
      desc: "Покупка/подписка. –50% за 3 друзей.",
      free: false,
      modules: [
        {
          id: "int_m1",
          title: "Модуль 1 — Материалы",
          lessons: [
            {
              id: "int_l1",
              title: "Ткань vs кожа",
              text:
`Ткань: быстро впитывает → важна экстракция и правильная химия.
Кожа: нельзя заливать/пересушивать → мягкие средства + защита.`,
              test: {
                q: "Что опаснее всего для кожи?",
                options: [
                  "Мягкое средство и защита",
                  "Сильная щёлочь и залив водой",
                  "Лёгкая влажная протирка",
                ],
                correctIndex: 1,
                explain: "Сильная химия и вода могут повредить кожу и швы.",
              },
            },
          ],
        },
      ],
    },
    {
      id: "polish",
      title: "Полировка",
      desc: "Техника, круги, пасты, этапы. PRO-доступ.",
      free: false,
      modules: [
        {
          id: "pol_m1",
          title: "Модуль 1 — Теория",
          lessons: [
            {
              id: "pol_l1",
              title: "Зачем полировка",
              text:
`Полировка — это контролируемое снятие/выравнивание микрослоя лака для устранения дефектов.
Важно: всегда начинать с минимально агрессивной связки.`,
              test: {
                q: "С чего правильно начинать?",
                options: [
                  "С максимально жёсткой пасты",
                  "С минимально агрессивной связки",
                  "С наждачки в любом случае",
                ],
                correctIndex: 1,
                explain: "Правильно — минимальная агрессия, затем при необходимости усиление.",
              },
            },
          ],
        },
      ],
    },
    {
      id: "protect",
      title: "Защита",
      desc: "Керамика/воск/силаенты, подготовка и нанесение.",
      free: false,
      modules: [
        {
          id: "pr_m1",
          title: "Модуль 1 — Подготовка",
          lessons: [
            {
              id: "pr_l1",
              title: "Подготовка под защиту",
              text:
`Любая защита держится на подготовке:
мойка → деконтаминация → обезжиривание → нанесение → выдержка.`,
              test: {
                q: "Что является ключевым для стойкости защиты?",
                options: [
                  "Только бренд состава",
                  "Подготовка поверхности",
                  "Солнечная погода",
                ],
                correctIndex: 1,
                explain: "Стойкость = подготовка поверхности и правильная технология нанесения.",
              },
            },
          ],
        },
      ],
    },
  ],
};

/* ---------- telegram init ---------- */
(function initTelegram() {
  safeSetText("greeting", nowGreeting());

  if (!tg) return;

  tg.ready();
  tg.expand();

  try { tg.setHeaderColor?.("#0b0d12"); } catch (e) {}
  try { tg.setBackgroundColor?.("#0b0d12"); } catch (e) {}

  const user = tg.initDataUnsafe?.user;
  if (user) {
    state.user = { id: String(user.id), name: user.first_name || "User" };
    safeSetText("username", state.user.name);
  }

  $("#closeBtn")?.addEventListener("click", () => tg.close());
})();

/* ---------- access logic ---------- */
function washDone() {
  return getProgress("course_wash_done");
}

// IMPORTANT: Admin sees everything open. Everyone else: free open, paid locked.
function isCourseLocked(course) {
  if (isAdmin()) return false;
  if (course.free) return false;
  return true; // paid locked for non-admin until we connect payments
}

/* ---------- progress helpers ---------- */
function allLessons(course) {
  return course.modules.flatMap((m) => m.lessons.map((l) => ({ ...l, moduleId: m.id })));
}

function coursePercent(courseId) {
  const course = academy.courses.find((c) => c.id === courseId);
  if (!course) return 0;

  const lessons = allLessons(course);
  const done = lessons.filter((l) => getProgress(`lesson_${courseId}_${l.id}_done`)).length;
  return Math.round((done / lessons.length) * 100);
}

function markLessonDone(courseId, lessonId) {
  setProgress(`lesson_${courseId}_${lessonId}_done`, true);

  const pct = coursePercent(courseId);
  if (pct === 100) {
    setProgress(`course_${courseId}_done`, true);
    if (courseId === "wash") setProgress("course_wash_done", true);
  }
}

/* ---------- SPA navigation (screens) ---------- */
function showTab(tab) {
  state.tab = tab;

  $$(".screen").forEach((s) => s.classList.remove("is-active"));
  $(`#screen-${tab}`)?.classList.add("is-active");

  $$(".nav__item").forEach((b) => b.classList.remove("is-active"));
  $(`.nav__item[data-tab="${tab}"]`)?.classList.add("is-active");

  if (tab === "courses") renderCoursesList();
  if (tab === "progress") renderProgress();
  if (tab === "bonus") renderBonus();
  if (tab === "profile") renderProfile();
}

/* bind nav buttons */
function bindNavigation() {
  $$(".nav__item").forEach((btn) => {
    btn.addEventListener("click", () => showTab(btn.dataset.tab));
  });

  $$("[data-go]").forEach((btn) => {
    btn.addEventListener("click", () => showTab(btn.dataset.go));
  });

  $("#openWash")?.addEventListener("click", () => {
    showTab("courses");
    renderCourseDetail("wash");
  });
}
bindNavigation();

/* ---------- render: courses list ---------- */
function renderCoursesList() {
  const root = document.getElementById("coursesRoot");
  if (!root) return;

  root.innerHTML = "";

  academy.courses.forEach(course => {
    const locked = isCourseLocked(course);
    const pct = coursePercent(course.id);

    const iconWash = `
      <svg viewBox="0 0 64 64" fill="none">
        <path d="M12 38h40l-4 10H16l-4-10z" stroke="currentColor" stroke-width="2"/>
        <path d="M18 38l6-14h16l6 14" stroke="currentColor" stroke-width="2"/>
        <path d="M24 18c0 4-4 6-4 10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <path d="M40 18c0 4 4 6 4 10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `;

    const iconInterior = `
      <svg viewBox="0 0 64 64" fill="none">
        <rect x="18" y="14" width="28" height="30" rx="6" stroke="currentColor" stroke-width="2"/>
        <path d="M18 28h28" stroke="currentColor" stroke-width="2"/>
        <circle cx="46" cy="20" r="3" fill="currentColor"/>
        <circle cx="50" cy="14" r="2" fill="currentColor"/>
      </svg>
    `;

    const iconPolish = `
      <svg viewBox="0 0 64 64" fill="none">
        <rect x="10" y="26" width="36" height="12" rx="6" stroke="currentColor" stroke-width="2"/>
        <circle cx="48" cy="32" r="6" stroke="currentColor" stroke-width="2"/>
        <path d="M20 44h24" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `;

    const iconProtect = `
      <svg viewBox="0 0 64 64" fill="none">
        <path d="M32 10l18 6v14c0 12-8 18-18 24-10-6-18-12-18-24V16l18-6z"
              stroke="currentColor" stroke-width="2"/>
        <path d="M24 30l6 6 10-12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `;

    const icon =
      course.id === "wash" ? iconWash :
      course.id === "interior" ? iconInterior :
      course.id === "polish" ? iconPolish :
      iconProtect;

    const card = document.createElement("div");
    card.className = `courseCard ${locked ? "locked" : "free"}`;

    card.innerHTML = `
      <div class="courseIcon">
        ${icon}
      </div>

      <div class="courseBody">
        <div class="badge">${locked ? "LOCKED" : course.free ? "FREE" : "PRO"} • ${pct}%</div>

        <h3 class="courseTitle">${course.title}</h3>
        <p class="courseDesc">${course.desc}</p>

        <div class="courseActions">
          <button class="btn ${locked ? "btn--ghost" : "btn--primary"}"
                  data-open-course="${course.id}">
            ${locked ? "🔒 Недоступно" : "Открыть"}
          </button>

          <button class="btn btn--ghost"
                  data-preview-course="${course.id}">
            Описание
          </button>
        </div>
      </div>
    `;

    root.appendChild(card);
  });

  // handlers
  document.querySelectorAll("[data-open-course]").forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.openCourse;
      const course = academy.courses.find(c => c.id === id);
      if (!course) return;

      if (isCourseLocked(course)) {
        popup("Закрыто", "Этот курс платный. Доступ откроется после оплаты или подписки.");
        return;
      }
      renderCourseDetail(id);
    };
  });

  document.querySelectorAll("[data-preview-course]").forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.previewCourse;
      const course = academy.courses.find(c => c.id === id);
      if (course) popup(course.title, course.desc);
    };
  });
}


/* ---------- render: course detail ---------- */
function renderCourseDetail(courseId) {
  const root = $("#coursesRoot");
  const course = academy.courses.find((c) => c.id === courseId);
  if (!root || !course) return;

  root.innerHTML = `
    <div class="glass">
      <div class="row" style="justify-content:space-between;align-items:center">
        <strong>${course.title}</strong>
        <button class="btn btn--ghost" id="backToCourses">← Назад</button>
      </div>
      <div class="hr"></div>
      <div class="muted">${course.desc}</div>
      <div class="muted small" style="margin-top:6px">Прогресс: <strong>${fmtPct(coursePercent(courseId))}</strong></div>
    </div>
  `;

  course.modules.forEach((m) => {
    const block = document.createElement("div");
    block.className = "lesson";

    block.innerHTML = `
      <div class="row" style="justify-content:space-between;align-items:center">
        <strong>${m.title}</strong>
        <span class="badge lock">${m.lessons.length} урок(а)</span>
      </div>
      <div class="hr"></div>
      ${m.lessons.map((l) => {
        const done = getProgress(`lesson_${courseId}_${l.id}_done`);
        return `
          <div class="item">
            <div>
              <strong>${l.title}</strong>
              <div class="muted small">${done ? "✅ пройдено" : "🟡 не пройдено"}</div>
            </div>
            <button class="btn btn--primary" data-open-lesson="${courseId}|${m.id}|${l.id}">Открыть</button>
          </div>
        `;
      }).join("")}
    `;
    root.appendChild(block);
  });

  $("#backToCourses")?.addEventListener("click", renderCoursesList);

  $$("[data-open-lesson]").forEach((b) => {
    b.addEventListener("click", () => {
      const [cId, mId, lId] = b.dataset.openLesson.split("|");
      renderLesson(cId, mId, lId);
    });
  });
}

/* ---------- render: lesson ---------- */
function renderLesson(courseId, moduleId, lessonId) {
  const root = $("#coursesRoot");
  const course = academy.courses.find((c) => c.id === courseId);
  const module = course?.modules.find((m) => m.id === moduleId);
  const lesson = module?.lessons.find((l) => l.id === lessonId);
  if (!root || !course || !module || !lesson) return;

  root.innerHTML = `
    <div class="lesson">
      <div class="row" style="justify-content:space-between;align-items:center">
        <strong>${course.title}</strong>
        <button class="btn btn--ghost" id="backToCourse">← К модулям</button>
      </div>
      <div class="muted small" style="margin-top:6px">${module.title}</div>

      <div class="hr"></div>

      <h3>${lesson.title}</h3>
      <p class="muted" style="white-space:pre-line">${lesson.text}</p>

      <div class="hr"></div>

      <button class="btn btn--primary" id="startTest">Пройти тест</button>
    </div>
  `;

  $("#backToCourse")?.addEventListener("click", () => renderCourseDetail(courseId));
  $("#startTest")?.addEventListener("click", () => renderTest(courseId, moduleId, lessonId));
}

/* ---------- render: test ---------- */
function renderTest(courseId, moduleId, lessonId) {
  const root = $("#coursesRoot");
  const course = academy.courses.find((c) => c.id === courseId);
  const module = course?.modules.find((m) => m.id === moduleId);
  const lesson = module?.lessons.find((l) => l.id === lessonId);
  const test = lesson?.test;
  if (!root || !test) return;

  root.innerHTML = `
    <div class="lesson">
      <div class="row" style="justify-content:space-between;align-items:center">
        <strong>Тест</strong>
        <button class="btn btn--ghost" id="backToLesson">← К уроку</button>
      </div>

      <div class="hr"></div>

      <h3>${test.q}</h3>
      <div id="opts"></div>

      <div class="hr"></div>
      <div class="muted small">Выбери один вариант</div>
    </div>
  `;

  $("#backToLesson")?.addEventListener("click", () => renderLesson(courseId, moduleId, lessonId));

  const opts = $("#opts");
  test.options.forEach((txt, idx) => {
    const b = document.createElement("button");
    b.className = "opt";
    b.type = "button";
    b.textContent = txt;
    b.addEventListener("click", () => {
      const ok = idx === test.correctIndex;

      if (ok) {
        markLessonDone(courseId, lessonId);
        popup("✅ Сдано", test.explain);
        renderCourseDetail(courseId);
      } else {
        popup("❌ Не сдано", `Неправильно.\n\n${test.explain}\n\nПовтори урок и попробуй снова.`);
        renderLesson(courseId, moduleId, lessonId);
      }
    });
    opts.appendChild(b);
  });
}

/* ---------- render: progress ---------- */
function renderProgress() {
  const root = $("#progressRoot");
  if (!root) return;

  root.innerHTML = `
    <div class="muted small">Прогресс хранится локально на устройстве (позже подключим сервер и привязку к Telegram ID).</div>
    <div class="hr"></div>
    ${academy.courses.map((c) => {
      const pct = coursePercent(c.id);
      const done = pct === 100;
      const locked = isCourseLocked(c);
      return `
        <div class="item">
          <div>
            <strong>${c.title}</strong>
            <div class="muted small">${locked ? "🔒 закрыт" : (done ? "✅ пройден" : "🟡 в процессе")}</div>
          </div>
          <span class="badge ${done ? "ok" : (locked ? "lock" : "ok")}">${fmtPct(pct)}</span>
        </div>
      `;
    }).join("")}
    <button class="btn btn--ghost" id="resetProgress" type="button">Сбросить прогресс</button>
  `;

  $("#resetProgress")?.addEventListener("click", () => {
    state.progress = {};
    saveProgress();
    popup("Готово", "Прогресс сброшен.");
    renderProgress();
  });
}

/* ---------- render: bonus ---------- */
function renderBonus() {
  const root = $("#bonusRoot");
  if (!root) return;

  root.innerHTML = `
    <div class="item">
      <div>
        <strong>Рефералы</strong>
        <div class="muted small">3 друга = –50% на Химчистку (сделаем после Stars)</div>
      </div>
      <span class="badge lock">скоро</span>
    </div>
    <div class="item">
      <div>
        <strong>Подписки</strong>
        <div class="muted small">Курсы / Сопровождение / Комплекс</div>
      </div>
      <span class="badge lock">скоро</span>
    </div>
  `;
}

/* ---------- render: profile ---------- */
function renderProfile() {
  const root = $("#profileRoot");
  if (!root) return;

  const id = getTelegramUserId();

  root.innerHTML = `
    <div class="item">
      <div>
        <strong>Пользователь</strong>
        <div class="muted small">${state.user.name}</div>
        <div class="muted small" style="margin-top:4px">TG ID: ${id ?? "нет (браузер)"}</div>
        ${isAdmin() ? `<div class="badge ok" style="margin-top:10px; display:inline-block">ADMIN MODE</div>` : ``}
      </div>
      <span class="badge ok">OK</span>
    </div>

    <div class="row" style="margin-top:10px">
      <button class="btn btn--primary" id="goCourses" type="button">Открыть курсы</button>
      <button class="btn btn--ghost" id="goProgress" type="button">Прогресс</button>
    </div>
  `;

  $("#goCourses")?.addEventListener("click", () => showTab("courses"));
  $("#goProgress")?.addEventListener("click", () => showTab("progress"));
}

/* ---------- start ---------- */
showTab("home");
