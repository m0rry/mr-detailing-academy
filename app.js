/* MR Detailing Academy — stable app.js (no-bugs nav + renders)
   Требования к index.html:
   - экраны: #screen-home #screen-courses #screen-progress #screen-bonus #screen-support #screen-profile (class="screen")
   - верхние карточки: [data-go="home|courses|progress|bonus|support|profile"]
   - нижние кнопки: .nav__item[data-tab="..."]
   - контейнеры: #coursesRoot #progressRoot #bonusRoot #supportRoot #profileRoot
*/
document.documentElement.insertAdjacentHTML(
  "beforeend",
  `<div style="
    position:fixed;top:10px;right:10px;z-index:999999;
    padding:8px 10px;border-radius:10px;
    background:rgba(51,214,166,.18);
    border:1px solid rgba(51,214,166,.55);
    color:#fff;font:12px -apple-system,system-ui">
    ✅ app.js LOADED
  </div>`
);

(() => {
  const tg = window.Telegram?.WebApp;

  // ===== SET ADMIN TG ID HERE =====
  // Узнай свой id через @userinfobot
  const ADMIN_TG_IDS = new Set([
    123456789 // <-- ЗАМЕНИ НА СВОЙ ID
  ]);

  const $ = (q) => document.querySelector(q);
  const $$ = (q) => Array.from(document.querySelectorAll(q));

  // ---------- utils ----------
  function popup(title, message) {
    try {
      if (tg?.showPopup) tg.showPopup({ title, message, buttons: [{ type: "ok" }] });
      else alert(`${title}\n\n${message}`);
    } catch {
      alert(`${title}\n\n${message}`);
    }
  }

  function getTelegramUserId() {
    const u = tg?.initDataUnsafe?.user;
    return u?.id ? Number(u.id) : null;
  }

  function isAdmin() {
    const id = getTelegramUserId();
    return id != null && ADMIN_TG_IDS.has(id);
  }

  // ---------- data (MVP) ----------
  const academy = {
    courses: [
      {
        id: "wash",
        free: true,
        title: "Курс мойки",
        desc: "Обязательная база. Откроет доступ к платным курсам.",
        icon: "wash",
        modules: [
          {
            id: "wash_m1",
            title: "Модуль 1 — Основы",
            lessons: [
              {
                id: "wash_l1",
                title: "Что такое детейлинг",
                text:
`Детейлинг — это системный уход за авто: очистка + восстановление + защита.
Цель: стабильный результат и сохранение покрытия.`,
                test: {
                  q: "Детейлинг — это…",
                  options: [
                    "Просто мойка с пеной",
                    "Системный уход: очистка + восстановление + защита",
                    "Только полировка"
                  ],
                  correct: 1,
                  explain: "Детейлинг включает очистку, восстановление и защиту."
                }
              },
              {
                id: "wash_l2",
                title: "Ошибки новичков",
                text:
`Ошибки:
1) Одна губка на всё → микроцарапины
2) Мойка по сухой пыли
3) Сильная химия без контроля
4) Плохая сушка → разводы`,
                test: {
                  q: "Что чаще всего вызывает микроцарапины?",
                  options: [
                    "Одна губка/тряпка на всё",
                    "Раздельные ведра и микрофибры",
                    "Сушка воздухом"
                  ],
                  correct: 0,
                  explain: "Одна губка собирает абразив и царапает ЛКП."
                }
              }
            ]
          }
        ]
      },
      {
        id: "interior",
        free: false,
        title: "Химчистка салона",
        desc: "Покупка/подписка. –50% за 3 друзей.",
        icon: "interior",
        modules: [
          {
            id: "int_m1",
            title: "Модуль 1 — Материалы",
            lessons: [
              {
                id: "int_l1",
                title: "Ткань vs кожа",
                text:
`Ткань: впитывает → важна экстракция.
Кожа: нельзя заливать/пересушивать → мягкие средства + защита.`,
                test: {
                  q: "Что опаснее всего для кожи?",
                  options: [
                    "Мягкое средство и защита",
                    "Сильная щёлочь и залив водой",
                    "Лёгкая влажная протирка"
                  ],
                  correct: 1,
                  explain: "Сильная химия и вода могут повредить кожу и швы."
                }
              }
            ]
          }
        ]
      },
      {
        id: "polish",
        free: false,
        title: "Полировка",
        desc: "Техника, круги, пасты, этапы. PRO-доступ.",
        icon: "polish",
        modules: [
          {
            id: "pol_m1",
            title: "Модуль 1 — Теория",
            lessons: [
              {
                id: "pol_l1",
                title: "Зачем полировка",
                text:
`Полировка — контролируемое выравнивание микрослоя лака для устранения дефектов.
Начинай с минимально агрессивной связки.`,
                test: {
                  q: "С чего правильно начинать?",
                  options: [
                    "С максимально жёсткой пасты",
                    "С минимально агрессивной связки",
                    "С наждачки в любом случае"
                  ],
                  correct: 1,
                  explain: "Правильно — минимальная агрессия, затем усиление при необходимости."
                }
              }
            ]
          }
        ]
      },
      {
        id: "protect",
        free: false,
        title: "Защита",
        desc: "Керамика/воск/силаенты: подготовка и нанесение.",
        icon: "protect",
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
                  q: "Ключ к стойкости защиты?",
                  options: [
                    "Только бренд состава",
                    "Подготовка поверхности",
                    "Солнечная погода"
                  ],
                  correct: 1,
                  explain: "Стойкость = подготовка + правильная технология."
                }
              }
            ]
          }
        ]
      }
    ]
  };

  // ---------- storage ----------
  const state = {
    tab: "home",
    progress: safeJson(localStorage.getItem("mr_progress")) || {}
  };

  function safeJson(s) {
    try { return JSON.parse(s); } catch { return null; }
  }
  function save() {
    localStorage.setItem("mr_progress", JSON.stringify(state.progress));
  }
  function setP(k, v) { state.progress[k] = v; save(); }
  function getP(k) { return !!state.progress[k]; }

  function courseLessons(course) {
    return course.modules.flatMap(m => m.lessons.map(l => ({ ...l, moduleId: m.id, moduleTitle: m.title })));
  }
  function coursePercent(courseId) {
    const c = academy.courses.find(x => x.id === courseId);
    if (!c) return 0;
    const lessons = courseLessons(c);
    const done = lessons.filter(l => getP(`lesson_${courseId}_${l.id}_done`)).length;
    return Math.round((done / lessons.length) * 100);
  }
  function markLessonDone(courseId, lessonId) {
    setP(`lesson_${courseId}_${lessonId}_done`, true);
    if (coursePercent(courseId) === 100) setP(`course_${courseId}_done`, true);
    if (courseId === "wash" && coursePercent(courseId) === 100) setP("course_wash_done", true);
  }

  // ---------- access rules ----------
  function isCourseLocked(course) {
    if (isAdmin()) return false;     // только ты видишь всё
    if (course.free) return false;   // free открыт всем
    return true;                     // платные закрыты до Stars
  }

  function boughtCoursesCount() {
    // В MVP: считаем купленными флаги course_{id}_purchased
    // позже ставим автоматически после Stars
    return academy.courses.filter(c => getP(`course_${c.id}_purchased`)).length;
  }

  function hasSupportAccess() {
    if (isAdmin()) return true;
    const forever = boughtCoursesCount() >= 3;
    const sub = getP("support_sub_active");
    return forever || sub;
  }

  // ---------- icons ----------
  function svgRight(kind) {
    if (kind === "wash") return `
      <svg viewBox="0 0 64 64" fill="none">
        <path d="M12 38h40l-4 10H16l-4-10z" stroke="currentColor"/>
        <path d="M18 38l6-14h16l6 14" stroke="currentColor"/>
        <path d="M24 18c0 4-4 6-4 10" stroke="currentColor" stroke-linecap="round"/>
        <path d="M40 18c0 4 4 6 4 10" stroke="currentColor" stroke-linecap="round"/>
      </svg>`;
    if (kind === "interior") return `
      <svg viewBox="0 0 64 64" fill="none">
        <rect x="18" y="14" width="28" height="30" rx="6" stroke="currentColor"/>
        <path d="M18 28h28" stroke="currentColor"/>
        <circle cx="46" cy="20" r="3" fill="currentColor"/>
        <circle cx="50" cy="14" r="2" fill="currentColor"/>
      </svg>`;
    if (kind === "polish") return `
      <svg viewBox="0 0 64 64" fill="none">
        <rect x="10" y="26" width="36" height="12" rx="6" stroke="currentColor"/>
        <circle cx="48" cy="32" r="6" stroke="currentColor"/>
        <path d="M20 44h24" stroke="currentColor" stroke-linecap="round"/>
      </svg>`;
    return `
      <svg viewBox="0 0 64 64" fill="none">
        <path d="M32 10l18 6v14c0 12-8 18-18 24-10-6-18-12-18-24V16l18-6z" stroke="currentColor"/>
        <path d="M24 30l6 6 10-12" stroke="currentColor" stroke-linecap="round"/>
      </svg>`;
  }

  // ---------- navigation (THE KEY FIX) ----------
  function showTab(tab) {
    state.tab = tab;

    $$(".screen").forEach(s => s.classList.remove("is-active"));
    const target = $("#screen-" + tab);
    (target || $("#screen-home"))?.classList.add("is-active");

    $$(".nav__item").forEach(b => b.classList.remove("is-active"));
    $(`.nav__item[data-tab="${tab}"]`)?.classList.add("is-active");

    // safe renders (не падаем если контейнера нет)
    if (tab === "courses") renderCoursesList();
    if (tab === "progress") renderProgress();
    if (tab === "bonus") renderBonus();
    if (tab === "support") renderSupport();
    if (tab === "profile") renderProfile();
  }

  // Делегирование кликов: работает даже если DOM перерисован
  function bindDelegation() {
    document.addEventListener("click", (e) => {
      const go = e.target.closest("[data-go]");
      if (go) { e.preventDefault(); showTab(go.dataset.go); return; }

      const tab = e.target.closest(".nav__item[data-tab]");
      if (tab) { e.preventDefault(); showTab(tab.dataset.tab); return; }

      const openCourse = e.target.closest("[data-open-course]");
      if (openCourse) { e.preventDefault(); onOpenCourse(openCourse.dataset.openCourse); return; }

      const previewCourse = e.target.closest("[data-preview-course]");
      if (previewCourse) { e.preventDefault(); onPreviewCourse(previewCourse.dataset.previewCourse); return; }

      const backCourses = e.target.closest("#backCourses");
      if (backCourses) { e.preventDefault(); renderCoursesList(); return; }

      const openLesson = e.target.closest("[data-open-lesson]");
      if (openLesson) { e.preventDefault(); onOpenLesson(openLesson.dataset.openLesson); return; }

      const backToModules = e.target.closest("#backToModules");
      if (backToModules) { e.preventDefault(); onBackToModules(backToModules.dataset.backToModules); return; }

      const startTest = e.target.closest("#startTest");
      if (startTest) { e.preventDefault(); onStartTest(startTest.dataset.startTest); return; }

      const testOpt = e.target.closest("[data-test-opt]");
      if (testOpt) { e.preventDefault(); onPickTest(testOpt.dataset.testOpt); return; }

      const supportBuy = e.target.closest("#supportBuy");
      if (supportBuy) { e.preventDefault(); onSupportBuy(); return; }

      const supportForever = e.target.closest("#supportForever");
      if (supportForever) { e.preventDefault(); onSupportForever(); return; }

      const goCourses = e.target.closest("#goCourses");
      if (goCourses) { e.preventDefault(); showTab("courses"); return; }

      const goSupport = e.target.closest("#goSupport");
      if (goSupport) { e.preventDefault(); showTab("support"); return; }
    }, true);
  }

  // ---------- renders ----------
  function renderCoursesList() {
    const root = $("#coursesRoot");
    if (!root) return;

    root.innerHTML = "";
    academy.courses.forEach(course => {
      const locked = isCourseLocked(course);
      const pct = coursePercent(course.id);

      const el = document.createElement("div");
      el.className = `courseCard ${locked ? "locked" : "free"}`;
      el.innerHTML = `
        <div class="rightIcon">${svgRight(course.icon)}</div>

        <div class="badge ${locked ? "lock" : "ok"}">${locked ? "LOCKED" : (course.free ? "FREE" : "PRO")} • ${pct}%</div>
        <div class="courseTitle">${course.title}</div>
        <div class="courseDesc">${course.desc}</div>

        <div class="progressLine"><i style="width:${pct}%"></i></div>

        <div class="courseActions">
          <button class="btn ${locked ? "btn--ghost" : "btn--primary"}" data-open-course="${course.id}">
            ${locked ? "🔒 Недоступно" : "Открыть"}
          </button>
          <button class="btn btn--ghost" data-preview-course="${course.id}">Описание</button>
        </div>
      `;
      root.appendChild(el);
    });
  }

  function onOpenCourse(courseId) {
    const course = academy.courses.find(c => c.id === courseId);
    if (!course) return;

    if (isCourseLocked(course)) {
      popup("Закрыто", "Платный курс. Доступ откроем через Telegram Stars/подписку (следующий шаг).");
      return;
    }
    renderCourseDetail(courseId);
  }

  function onPreviewCourse(courseId) {
    const course = academy.courses.find(c => c.id === courseId);
    if (course) popup(course.title, course.desc);
  }

  function renderCourseDetail(courseId) {
    const root = $("#coursesRoot");
    const course = academy.courses.find(c => c.id === courseId);
    if (!root || !course) return;

    root.innerHTML = `
      <div class="glass" style="padding:14px">
        <div style="display:flex; justify-content:space-between; gap:12px; align-items:center">
          <div>
            <div style="font-weight:950; font-size:18px">${course.title}</div>
            <div class="muted small" style="margin-top:4px">${course.desc}</div>
            <div class="muted small" style="margin-top:6px">Прогресс: <b>${coursePercent(courseId)}%</b></div>
          </div>
          <button class="btn btn--ghost" id="backCourses">← Назад</button>
        </div>
      </div>
      <div style="height:10px"></div>
    `;

    course.modules.forEach(m => {
      const block = document.createElement("div");
      block.className = "glass";
      block.style.padding = "14px";
      block.style.marginTop = "12px";

      block.innerHTML = `
        <div style="display:flex;justify-content:space-between;gap:12px;align-items:center">
          <div style="font-weight:950">${m.title}</div>
          <span class="badge lock">${m.lessons.length} урок(а)</span>
        </div>
        <div class="hr"></div>
        ${m.lessons.map(l => {
          const done = getP(`lesson_${courseId}_${l.id}_done`);
          return `
            <div class="item" style="margin-top:10px">
              <div>
                <div style="font-weight:900">${l.title}</div>
                <div class="muted small">${done ? "✅ пройдено" : "🟡 не пройдено"}</div>
              </div>
              <button class="btn btn--primary" data-open-lesson="${courseId}|${m.id}|${l.id}">Открыть</button>
            </div>`;
        }).join("")}
      `;
      root.appendChild(block);
    });
  }

  function onOpenLesson(payload) {
    const [courseId, moduleId, lessonId] = payload.split("|");
    renderLesson(courseId, moduleId, lessonId);
  }

  function renderLesson(courseId, moduleId, lessonId) {
    const root = $("#coursesRoot");
    const course = academy.courses.find(c => c.id === courseId);
    const mod = course?.modules.find(m => m.id === moduleId);
    const lesson = mod?.lessons.find(l => l.id === lessonId);
    if (!root || !lesson || !course || !mod) return;

    root.innerHTML = `
      <div class="glass" style="padding:14px">
        <div style="display:flex;justify-content:space-between;gap:12px;align-items:center">
          <div>
            <div style="font-weight:950">${course.title}</div>
            <div class="muted small" style="margin-top:4px">${mod.title}</div>
          </div>
          <button class="btn btn--ghost" id="backToModules" data-back-to-modules="${courseId}">← К модулям</button>
        </div>
        <div class="hr"></div>
        <div style="font-weight:950; font-size:18px">${lesson.title}</div>
        <div class="muted" style="white-space:pre-line; margin-top:8px; line-height:1.45">${lesson.text}</div>
        <div class="hr"></div>
        <button class="btn btn--primary" id="startTest" data-start-test="${courseId}|${moduleId}|${lessonId}">Пройти тест</button>
      </div>
    `;
  }

  function onBackToModules(courseId) {
    renderCourseDetail(courseId);
  }

  function onStartTest(payload) {
    const [courseId, moduleId, lessonId] = payload.split("|");
    renderTest(courseId, moduleId, lessonId);
  }

  function renderTest(courseId, moduleId, lessonId) {
    const root = $("#coursesRoot");
    const course = academy.courses.find(c => c.id === courseId);
    const mod = course?.modules.find(m => m.id === moduleId);
    const lesson = mod?.lessons.find(l => l.id === lessonId);
    const test = lesson?.test;
    if (!root || !test) return;

    root.innerHTML = `
      <div class="glass" style="padding:14px">
        <div style="display:flex;justify-content:space-between;gap:12px;align-items:center">
          <div style="font-weight:950">Тест</div>
          <button class="btn btn--ghost" id="backToModules" data-back-to-modules="${courseId}">← Назад</button>
        </div>
        <div class="hr"></div>
        <div style="font-weight:950; font-size:18px">${test.q}</div>
        <div style="margin-top:12px; display:grid; gap:10px">
          ${test.options.map((t, idx) => `
            <button class="btn btn--ghost" style="justify-content:flex-start"
              data-test-opt="${courseId}|${moduleId}|${lessonId}|${idx}">
              ${t}
            </button>
          `).join("")}
        </div>
        <div class="hr"></div>
        <div class="muted small">Выбери один вариант</div>
      </div>
    `;
  }

  function onPickTest(payload) {
    const [courseId, moduleId, lessonId, idxStr] = payload.split("|");
    const idx = Number(idxStr);

    const course = academy.courses.find(c => c.id === courseId);
    const mod = course?.modules.find(m => m.id === moduleId);
    const lesson = mod?.lessons.find(l => l.id === lessonId);
    const test = lesson?.test;
    if (!test) return;

    if (idx === test.correct) {
      markLessonDone(courseId, lessonId);
      popup("✅ Сдано", test.explain);
      renderCourseDetail(courseId);
    } else {
      popup("❌ Не сдано", "Неправильно. Повтори урок и попробуй снова.\n\n" + test.explain);
      renderLesson(courseId, moduleId, lessonId);
    }
  }

  function renderProgress() {
    const root = $("#progressRoot");
    if (!root) return;
    root.innerHTML = "";

    academy.courses.forEach(c => {
      const pct = coursePercent(c.id);
      const locked = isCourseLocked(c);

      const el = document.createElement("div");
      el.className = "item";
      el.style.marginTop = "10px";
      el.innerHTML = `
        <div>
          <div style="font-weight:950">${c.title}</div>
          <div class="muted small">${locked ? "🔒 закрыт" : (pct === 100 ? "✅ пройден" : "🟡 в процессе")}</div>
        </div>
        <span class="badge ${locked ? "lock" : "ok"}">${pct}%</span>
      `;
      root.appendChild(el);
    });

    const reset = document.createElement("button");
    reset.className = "btn btn--ghost";
    reset.style.marginTop = "12px";
    reset.textContent = "Сбросить прогресс";
    reset.addEventListener("click", () => {
      state.progress = {};
      save();
      popup("Готово", "Прогресс сброшен.");
      renderProgress();
    });
    root.appendChild(reset);
  }

  function renderBonus() {
    const root = $("#bonusRoot");
    if (!root) return;

    root.innerHTML = `
      <div class="glass" style="padding:14px">
        <div class="item">
          <div>
            <div style="font-weight:950">Рефералы</div>
            <div class="muted small" style="margin-top:4px">Приведи 3 друзей — получи –50% на Химчистку (подключим после Stars)</div>
          </div>
          <span class="badge lock">скоро</span>
        </div>
        <div style="height:10px"></div>
        <div class="item">
          <div>
            <div style="font-weight:950">Пакеты</div>
            <div class="muted small" style="margin-top:4px">Курсы / Сопровождение / Комплекс со скидкой</div>
          </div>
          <span class="badge lock">скоро</span>
        </div>
      </div>
    `;
  }

  function renderSupport() {
    const root = $("#supportRoot");
    if (!root) return;

    const access = hasSupportAccess();
    root.innerHTML = `
      <div class="glass" style="padding:14px">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:12px">
          <div>
            <div style="font-weight:950; font-size:18px">Чаты и помощь</div>
            <div class="muted small" style="margin-top:6px">
              Доступ: подписка на месяц (Stars) <b>или</b> навсегда, если куплено <b>3+ курса</b>.
            </div>
            <div style="margin-top:10px">
              <span class="badge ${access ? "ok" : "lock"}">${access ? "ДОСТУП ЕСТЬ" : "НУЖЕН ДОСТУП"}</span>
            </div>
          </div>
        </div>

        <div class="hr"></div>

        <div class="item">
          <div>
            <div style="font-weight:950">Закрытый чат учеников</div>
            <div class="muted small" style="margin-top:4px">Разборы, кейсы, советы, поддержка</div>
          </div>
          <span class="badge ${access ? "ok" : "lock"}">${access ? "OPEN" : "PRO"}</span>
        </div>

        <div style="height:10px"></div>

        <div class="item">
          <div>
            <div style="font-weight:950">Чат с наставником</div>
            <div class="muted small" style="margin-top:4px">Вопросы по работам, подбор химии, разбор ошибок</div>
          </div>
          <span class="badge ${access ? "ok" : "lock"}">${access ? "OPEN" : "PRO"}</span>
        </div>

        <div class="hr"></div>

        <div style="display:grid; gap:10px">
          <button class="btn btn--primary" id="supportBuy">${access ? "Открыть чат" : "Оформить подписку (скоро Stars)"}</button>
          <button class="btn btn--ghost" id="supportForever">Как получить навсегда?</button>
        </div>
      </div>
    `;
  }

  function onSupportBuy() {
    if (hasSupportAccess()) {
      popup("Чаты", "Следующим шагом подключим реальные ссылки/инвайты в закрытые чаты.");
    } else {
      popup("Скоро", "Подключим Telegram Stars и сделаем подписку/покупки по-взрослому.");
    }
  }

  function onSupportForever() {
    popup("Навсегда", "Навсегда выдаётся автоматически, если куплено 3+ курса. После Stars это будет считаться автоматически.");
  }

  function renderProfile() {
    const root = $("#profileRoot");
    if (!root) return;

    const uid = getTelegramUserId();
    root.innerHTML = `
      <div class="glass" style="padding:14px">
        <div class="item">
          <div>
            <div style="font-weight:950">Пользователь</div>
            <div class="muted small" style="margin-top:6px">TG ID: <b>${uid ?? "нет (браузер)"}</b></div>
            ${isAdmin() ? `<div style="margin-top:10px"><span class="badge ok">ADMIN MODE</span></div>` : ``}
          </div>
          <span class="badge ok">OK</span>
        </div>

        <div class="hr"></div>

        <div style="display:grid; gap:10px">
          <button class="btn btn--primary" id="goCourses">Открыть курсы</button>
          <button class="btn btn--ghost" id="goSupport">Сопровождение</button>
        </div>
      </div>
    `;
  }

  // ---------- init ----------
  function initTelegram() {
    if (!tg) return;
    try { tg.ready(); } catch {}
    try { tg.expand(); } catch {}
    // close button if you have it
    const closeBtn = $("#closeBtn");
    if (closeBtn) closeBtn.addEventListener("click", () => { try { tg.close(); } catch {} });
  }

  function init() {
    initTelegram();
    bindDelegation();

    // ВАЖНО: показать home даже если где-то что-то не так
    showTab("home");
  }

  // Run after DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
