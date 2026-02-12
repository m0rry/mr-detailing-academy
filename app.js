// MR Detailing Academy — app.js (WORKING)
// Compatible with the index.html I sent (screen-* sections + bottom nav data-tab)

const tg = window.Telegram?.WebApp;
const $ = (q) => document.querySelector(q);
const $$ = (q) => Array.from(document.querySelectorAll(q));

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
  if (h < 20) return "Добрый вечер,";
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
      desc: "Обязательная база. Откроет доступ к платным курсам.",
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

Цель: не “быстро помыть”, а сделать стабильный результат и сохранить покрытие.`,
              test: {
                q: "Детейлинг — это…",
                options: [
                  "Просто мойка с пеной",
                  "Системный уход: очистка + восстановление + защита",
                  "Только полировка кузова",
                ],
                correctIndex: 1, // 0-based
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

/* ---------- SPA navigation (screens) ---------- */
function showTab(tab) {
  state.tab = tab;

  // screens
  $$(".screen").forEach((s) => s.classList.remove("is-active"));
  $(`#screen-${tab}`)?.classList.add("is-active");

  // bottom nav active
  $$(".nav__item").forEach((b) => b.classList.remove("is-active"));
  $(`.nav__item[data-tab="${tab}"]`)?.classList.add("is-active");

  // tab renders
  if (tab === "courses") renderCoursesList();
  if (tab === "progress") renderProgress();
  if (tab === "bonus") renderBonus();
  if (tab === "profile") renderProfile();
}

/* bind nav buttons */
function bindNavigation() {
  // bottom nav
  $$(".nav__item").forEach((btn) => {
    btn.addEventListener("click", () => showTab(btn.dataset.tab));
  });

  // any data-go buttons
  $$("[data-go]").forEach((btn) => {
    btn.addEventListener("click", () => showTab(btn.dataset.go));
  });

  // home main CTA
  $("#openWash")?.addEventListener("click", () => {
    showTab("courses");
    renderCourseDetail("wash");
  });
}
bindNavigation();

/* ---------- access logic ---------- */
function washDone() {
  return getProgress("course_wash_done");
}

function isCourseLocked(course) {
  if (course.free) return false;
  return !washDone(); // lock all paid until wash completed (MVP rule)
}

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

  // if course completed
  const pct = coursePercent(courseId);
  if (pct === 100) {
    setProgress(`course_${courseId}_done`, true);
    if (courseId === "wash") setProgress("course_wash_done", true);
  }
}

/* ---------- render: courses list ---------- */
function courseArtSvg(kind) {
  // Premium inline SVG (без файлов) — выглядит как “арт” внутри карточки
  const common = `opacity=".95"`;
  const svgWrap = (inner) =>
    `data:image/svg+xml,${encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='900' height='360' viewBox='0 0 900 360'>
        <defs>
          <linearGradient id='g1' x1='0' y1='0' x2='1' y2='1'>
            <stop offset='0' stop-color='rgba(155,124,255,.65)'/>
            <stop offset='1' stop-color='rgba(51,214,166,.35)'/>
          </linearGradient>
          <filter id='blur'><feGaussianBlur stdDeviation='8'/></filter>
        </defs>
        ${inner}
      </svg>`
    )}`;

  if (kind === "wash") {
    return svgWrap(`
      <circle cx='720' cy='120' r='90' fill='url(#g1)' filter='url(#blur)' ${common}/>
      <path d='M230 210c50-80 210-120 330-70 55 22 90 58 108 102 16 40-10 72-52 72H280c-42 0-70-36-50-104z'
            fill='rgba(255,255,255,.10)' stroke='rgba(255,255,255,.18)' stroke-width='4'/>
      <path d='M590 92c0 24-22 38-22 56a22 22 0 0 0 44 0c0-18-22-32-22-56z'
            fill='rgba(155,124,255,.55)'/>
      <circle cx='330' cy='282' r='22' fill='rgba(51,214,166,.22)'/>
      <circle cx='640' cy='282' r='22' fill='rgba(155,124,255,.18)'/>
    `);
  }

  if (kind === "interior") {
    return svgWrap(`
      <circle cx='760' cy='220' r='110' fill='url(#g1)' filter='url(#blur)' ${common}/>
      <path d='M300 85c-44 0-80 36-80 80v64c0 38 30 70 68 70h44c44 0 80-36 80-80v-54c0-44-36-80-80-80h-32z'
            fill='rgba(255,255,255,.10)' stroke='rgba(255,255,255,.18)' stroke-width='4'/>
      <path d='M238 186h256' stroke='rgba(155,124,255,.28)' stroke-width='8' stroke-linecap='round'/>
      <path d='M250 140h190' stroke='rgba(51,214,166,.20)' stroke-width='6' stroke-linecap='round'/>
    `);
  }

  if (kind === "polish") {
    return svgWrap(`
      <circle cx='710' cy='160' r='120' fill='url(#g1)' filter='url(#blur)' ${common}/>
      <rect x='250' y='110' width='360' height='78' rx='18'
            fill='rgba(255,255,255,.10)' stroke='rgba(255,255,255,.18)' stroke-width='4'/>
      <circle cx='360' cy='245' r='70' fill='rgba(155,124,255,.20)'/>
      <path d='M520 120l120-52' stroke='rgba(255,255,255,.22)' stroke-width='10' stroke-linecap='round'/>
      <path d='M310 245h100' stroke='rgba(51,214,166,.22)' stroke-width='10' stroke-linecap='round'/>
    `);
  }

  // protect
  return svgWrap(`
    <circle cx='720' cy='150' r='120' fill='url(#g1)' filter='url(#blur)' ${common}/>
    <path d='M450 70c70 40 120 18 120 18v96c0 70-52 118-120 142-68-24-120-72-120-142V88s50 22 120-18z'
          fill='rgba(255,255,255,.09)' stroke='rgba(255,255,255,.18)' stroke-width='4'/>
    <path d='M450 120v170' stroke='rgba(155,124,255,.26)' stroke-width='8' stroke-linecap='round'/>
  `);
}

function renderCoursesList() {
  const root = document.getElementById("coursesRoot");
  if (!root) return;

  root.innerHTML = "";

  academy.courses.forEach((course) => {
    const locked = isCourseLocked(course);
    const pct = coursePercent(course.id);
    const artKind =
      course.id === "wash" ? "wash" :
      course.id === "interior" ? "interior" :
      course.id === "polish" ? "polish" :
      "protect";

    const el = document.createElement("div");
    el.className = "courseCard";

    el.innerHTML = `
      <div class="courseCard__art" style="background-image:url('${courseArtSvg(artKind)}'); background-size:cover; background-position:center;"></div>
      <div class="courseCard__fade"></div>

      <div class="courseCard__top" style="position:relative; z-index:2;">
        <div>
          <div class="badgePill ${course.free ? "badgePill--free" : "badgePill--locked"}">
            ${course.free ? "FREE" : (locked ? "LOCKED" : "PRO")}
            <span style="opacity:.75">•</span>
            <span>${pct}%</span>
          </div>

          <div class="courseCard__title" style="margin-top:10px;">${course.title}</div>
          <div class="courseCard__desc">${course.desc}</div>

          <div class="progressLine"><i style="width:${pct}%;"></i></div>

          <div class="courseCard__actions">
            <button class="btn ${locked ? "btn--ghost" : "btn--primary"}" data-open-course="${course.id}">
              ${locked ? "🔒 Недоступно" : "Открыть"}
            </button>
            <button class="btn btn--ghost" data-preview-course="${course.id}">
              Описание
            </button>
          </div>
        </div>
      </div>

      ${locked ? `
        <div class="lockOverlay">
          <div class="lockOverlay__text">
            <span class="lockOverlay__dot"></span>
            Сначала пройди “Курс мойки”, чтобы открыть доступ
          </div>
        </div>` : ""}
    `;

    root.appendChild(el);
  });

  document.querySelectorAll("[data-open-course]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.openCourse;
      const course = academy.courses.find((c) => c.id === id);
      if (!course) return;

      if (isCourseLocked(course)) {
        popup("Закрыто", "Сначала пройди бесплатный курс «Мойка» — он откроет доступ к платным курсам.");
        return;
      }
      renderCourseDetail(id);
    });
  });

  document.querySelectorAll("[data-preview-course]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.previewCourse;
      const course = academy.courses.find((c) => c.id === id);
      if (!course) return;
      popup(course.title, course.desc);
    });
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
    <div class="muted small">Пока прогресс хранится локально (позже подключим сервер).</div>
    <div class="hr"></div>
    ${academy.courses.map((c) => {
      const pct = coursePercent(c.id);
      const done = pct === 100;
      return `
        <div class="item">
          <div>
            <strong>${c.title}</strong>
            <div class="muted small">${done ? "✅ пройден" : "🟡 в процессе"}</div>
          </div>
          <span class="badge ${done ? "ok" : "lock"}">${pct}%</span>
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
        <div class="muted small">3 друга = –50% на Химчистку</div>
      </div>
      <span class="badge lock">скоро</span>
    </div>
    <div class="item">
      <div>
        <strong>База знаний</strong>
        <div class="muted small">таблицы pH / круги / пасты</div>
      </div>
      <span class="badge lock">скоро</span>
    </div>
  `;
}

/* ---------- render: profile ---------- */
function renderProfile() {
  const root = $("#profileRoot");
  if (!root) return;

  root.innerHTML = `
    <div class="item">
      <div>
        <strong>Пользователь</strong>
        <div class="muted small">${state.user.name}</div>
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
