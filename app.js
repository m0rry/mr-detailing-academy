// --- Telegram WebApp bootstrap ---
const tg = window.Telegram?.WebApp;
const $ = (q) => document.querySelector(q);
const $$ = (q) => Array.from(document.querySelectorAll(q));

function safeSet(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

const state = {
  tab: "home",
  // учебное состояние
  user: { id: "local", name: "User" },
  // прогресс храним локально (потом вынесем на сервер)
  progress: JSON.parse(localStorage.getItem("mr_progress") || "{}"),
  // выбранный курс/урок
  current: { courseId: null, moduleId: null, lessonId: null }
};

function saveProgress() {
  localStorage.setItem("mr_progress", JSON.stringify(state.progress));
}

function setProgress(path, value) {
  state.progress[path] = value;
  saveProgress();
}

// --- Data (MVP обучение) ---
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

Цель: не “быстро помыть”, а получить стабильный, повторяемый результат и сохранить покрытие.`,
              test: {
                q: "Детейлинг — это…",
                options: [
                  "Просто мойка с пеной",
                  "Системный уход: очистка + восстановление + защита",
                  "Только полировка кузова"
                ],
                correct: 2,
                explain: "Правильно: детейлинг включает очистку, восстановление и защиту."
              }
            },
            {
              id: "wash_l2",
              title: "Ошибки новичков",
              text:
`Топ ошибок:
1) Одна губка на всё → царапины.
2) Мойка на сухую пыль.
3) Сильная химия без контроля pH.
4) Плохая сушка → разводы/водный камень.`,
              test: {
                q: "Что чаще всего вызывает микро-царапины?",
                options: [
                  "Раздельные ведра и микрофибры",
                  "Одна губка/тряпка на всё",
                  "Сушка воздухом"
                ],
                correct: 2,
                explain: "Одна губка/тряпка собирает абразив и царапает ЛКП."
              }
            }
          ]
        },
        {
          id: "wash_m2",
          title: "Модуль 2 — Процесс",
          lessons: [
            {
              id: "wash_l3",
              title: "Двухфазная мойка",
              text:
`Две фазы:
Фаза 1: бесконтакт (снять основную грязь).
Фаза 2: контакт (безопасно домыть).

Правило: контакт только после того, как снял максимум грязи бесконтактом.`,
              test: {
                q: "Зачем нужна первая фаза?",
                options: [
                  "Чтобы быстрее перейти к контакту",
                  "Чтобы снять основную грязь и снизить риск царапин",
                  "Чтобы высушить кузов"
                ],
                correct: 2,
                explain: "Фаза 1 снимает грязь — меньше абразива при контакте."
              }
            }
          ]
        }
      ]
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
`Ткань: быстро впитывает → важна правильная химия и экстракция.
Кожа: нельзя заливать/пересушивать → мягкие средства + защита.`,
              test: {
                q: "Что опаснее всего для кожи?",
                options: [
                  "Мягкое средство и защита",
                  "Сильная щёлочь и залив водой",
                  "Лёгкая влажная протирка"
                ],
                correct: 2,
                explain: "Сильная химия и вода могут испортить кожу и швы."
              }
            }
          ]
        }
      ]
    }
  ]
};

// --- Telegram init + greeting ---
if (tg) {
  tg.ready();
  tg.expand();
  try { tg.setHeaderColor?.("#0b0d12"); } catch(e){}
  try { tg.setBackgroundColor?.("#0b0d12"); } catch(e){}

  const user = tg.initDataUnsafe?.user;
  if (user) {
    state.user = { id: String(user.id), name: user.first_name || "User" };
    safeSet("username", state.user.name);
    const h = new Date().getHours();
    const greet = h < 12 ? "Доброе утро," : (h < 18 ? "Добрый день," : "Добрый вечер,");
    safeSet("greeting", greet);
  }

  $("#closeBtn")?.addEventListener("click", () => tg.close());
} else {
  const h = new Date().getHours();
  const greet = h < 12 ? "Доброе утро," : (h < 18 ? "Добрый день," : "Добрый вечер,");
  safeSet("greeting", greet);
}

// --- Parallax (как было) ---
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
function applyParallax(el, nx, ny) {
  const layers = el.querySelectorAll(".layer");
  layers.forEach((layer, i) => {
    const depth = (i + 1) * 10;
    layer.style.transform = `translate3d(${nx * depth}px, ${ny * depth}px, 0)`;
  });
}
function resetParallax(el) {
  el.querySelectorAll(".layer").forEach(l => (l.style.transform = "translate3d(0,0,0)"));
}
$$("[data-parallax]").forEach(el => {
  el.addEventListener("mousemove", (e) => {
    const r = el.getBoundingClientRect();
    const nx = clamp(((e.clientX - r.left) / r.width - 0.5) * 2, -1, 1);
    const ny = clamp(((e.clientY - r.top) / r.height - 0.5) * 2, -1, 1);
    applyParallax(el, nx, ny);
  });
  el.addEventListener("mouseleave", () => resetParallax(el));

  let touching = false;
  el.addEventListener("touchstart", () => { touching = true; }, {passive:true});
  el.addEventListener("touchend", () => { touching = false; resetParallax(el); }, {passive:true});
  el.addEventListener("touchmove", (e) => {
    if (!touching) return;
    const t = e.touches[0];
    const r = el.getBoundingClientRect();
    const nx = clamp(((t.clientX - r.left) / r.width - 0.5) * 2, -1, 1);
    const ny = clamp(((t.clientY - r.top) / r.height - 0.5) * 2, -1, 1);
    applyParallax(el, nx, ny);
  }, {passive:true});
});

// --- Navigation between screens ---
function showTab(tab) {
  state.tab = tab;
  $$(".screen").forEach(s => s.classList.remove("is-active"));
  $(`#screen-${tab}`)?.classList.add("is-active");

  $$(".nav__item").forEach(b => b.classList.remove("is-active"));
  $(`.nav__item[data-tab="${tab}"]`)?.classList.add("is-active");

  if (tab === "courses") renderCoursesHome();
  if (tab === "progress") renderProgress();
  if (tab === "bonus") renderBonus();
  if (tab === "profile") renderProfile();
}

$$(".nav__item").forEach(btn => {
  btn.addEventListener("click", () => showTab(btn.dataset.tab));
});

// mini buttons on home
$$("[data-go]").forEach(b => {
  b.addEventListener("click", () => showTab(b.dataset.go));
});

// --- учебные рендеры ---
function courseLocked(courseId) {
  const c = academy.courses.find(x => x.id === courseId);
  if (!c) return true;
  if (c.free) return false;

  // правило: платные курсы доступны после завершения мойки (wash)
  const washDone = !!state.progress[`course_wash_done`];
  return !washDone;
}

function markLessonDone(courseId, lessonId) {
  setProgress(`lesson_${courseId}_${lessonId}_done`, true);
}

function markCourseDone(courseId) {
  setProgress(`course_${courseId}_done`, true);
  if (courseId === "wash") setProgress(`course_wash_done`, true);
}

function coursePercent(courseId) {
  const course = academy.courses.find(c => c.id === courseId);
  if (!course) return 0;
  const lessons = course.modules.flatMap(m => m.lessons);
  const done = lessons.filter(l => state.progress[`lesson_${courseId}_${l.id}_done`]).length;
  return Math.round((done / lessons.length) * 100);
}

function renderCoursesHome() {
  const root = $("#coursesRoot");
  if (!root) return;

  root.innerHTML = "";

  academy.courses.forEach(course => {
    const locked = courseLocked(course.id);
    const pct = coursePercent(course.id);

    const el = document.createElement("article");
    el.className = "p-card";
    el.innerHTML = `
      <div class="p-card__frame"></div>
      <div class="p-card__bg ${course.id === "wash" ? "p-card__bg--wash" : "p-card__bg--interior"}"></div>
      <div class="p-card__shine"></div>
      <div class="layer layer--glow"></div>
      <div class="layer layer--particles"></div>

      <div class="p-card__content">
        <div class="tag ${course.free ? "tag--green" : (locked ? "tag--purple" : "tag--green")}">
          ${course.free ? "FREE" : (locked ? "LOCKED" : "OPEN")}
        </div>
        <h3>${course.title}</h3>
        <p class="muted">${course.desc}</p>
        <div class="row">
          <button class="btn ${(!course.free && locked) ? "btn--ghost" : "btn--primary"}" data-open-course="${course.id}">
            ${(!course.free && locked) ? "🔒 Недоступно" : "Открыть"}
          </button>
          <span class="badge ${pct===100?"ok":"lock"}">${pct}%</span>
        </div>
      </div>
    `;
    root.appendChild(el);
  });

  // bind open
  $$("[data-open-course]").forEach(btn => {
    btn.addEventListener("click", () => {
      const courseId = btn.dataset.openCourse;
      const locked = courseLocked(courseId);
      if (locked) {
        popup("Закрыто", "Сначала пройди бесплатный курс «Мойка» — он открывает доступ к платным курсам.");
        return;
      }
      renderCourseDetail(courseId);
    });
  });
}

function renderCourseDetail(courseId) {
  const root = $("#coursesRoot");
  const course = academy.courses.find(c => c.id === courseId);
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

  course.modules.forEach(mod => {
    const box = document.createElement("div");
    box.className = "lesson";
    box.innerHTML = `
      <div class="row" style="justify-content:space-between;align-items:center">
        <strong>${mod.title}</strong>
        <span class="badge lock">${mod.lessons.length} урок(а)</span>
      </div>
      <div class="hr"></div>
      ${mod.lessons.map(l => {
        const done = !!state.progress[`lesson_${courseId}_${l.id}_done`];
        return `
          <div class="item">
            <div>
              <strong>${l.title}</strong>
              <div class="muted small">${done ? "✅ пройдено" : "🟡 не пройдено"}</div>
            </div>
            <button class="btn btn--primary" data-open-lesson="${courseId}|${mod.id}|${l.id}">Открыть</button>
          </div>
        `;
      }).join("")}
    `;
    root.appendChild(box);
  });

  $("#backToCourses")?.addEventListener("click", renderCoursesHome);

  $$("[data-open-lesson]").forEach(b => {
    b.addEventListener("click", () => {
      const [cId, mId, lId] = b.dataset.openLesson.split("|");
      renderLesson(cId, mId, lId);
    });
  });
}

function renderLesson(courseId, moduleId, lessonId) {
  const root = $("#coursesRoot");
  const course = academy.courses.find(c => c.id === courseId);
  const module = course?.modules.find(m => m.id === moduleId);
  const lesson = module?.lessons.find(l => l.id === lessonId);
  if (!root || !lesson || !course || !module) return;

  root.innerHTML = `
    <div class="lesson">
      <div class="row" style="justify-content:space-between;align-items:center">
        <strong>${course.title}</strong>
        <button class="btn btn--ghost" id="backToCourse">← К модулю</button>
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

function renderTest(courseId, moduleId, lessonId) {
  const root = $("#coursesRoot");
  const course = academy.courses.find(c => c.id === courseId);
  const module = course?.modules.find(m => m.id === moduleId);
  const lesson = module?.lessons.find(l => l.id === lessonId);
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
      <div class="muted small" id="testHint">Выбери один вариант</div>
    </div>
  `;

  $("#backToLesson")?.addEventListener("click", () => renderLesson(courseId, moduleId, lessonId));

  const opts = $("#opts");
  test.options.forEach((txt, idx) => {
    const b = document.createElement("button");
    b.className = "opt";
    b.textContent = txt;
    b.addEventListener("click", () => {
      const chosen = idx + 1;
      const ok = chosen === test.correct;

      if (ok) {
        markLessonDone(courseId, lessonId);

        // если все уроки курса пройдены → курс done
        const pct = coursePercent(courseId);
        if (pct === 100) markCourseDone(courseId);

        popup("✅ Сдано", test.explain);
        renderCourseDetail(courseId);
      } else {
        popup("❌ Не сдано", `${test.explain}\n\nПравильный ответ: ${test.correct}. Повтори урок и попробуй снова.`);
        renderLesson(courseId, moduleId, lessonId);
      }
    });
    opts.appendChild(b);
  });
}

// --- progress/bonus/profile ---
function renderProgress() {
  const root = $("#progressRoot");
  if (!root) return;

  const lines = academy.courses.map(c => {
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
  }).join("");

  root.innerHTML = `
    <div class="muted">Твой прогресс считается локально (потом подключим сервер).</div>
    <div class="hr"></div>
    ${lines}
    <button class="btn btn--ghost" id="resetProgress">Сбросить прогресс</button>
  `;

  $("#resetProgress")?.addEventListener("click", () => {
    state.progress = {};
    saveProgress();
    renderProgress();
    popup("Готово", "Прогресс сброшен.");
  });
}

function renderBonus() {
  const root = $("#bonusRoot");
  if (!root) return;

  // пока простая заглушка, далее прикрутим рефералку
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
        <div class="muted small">таблицы: pH / круги / пасты</div>
      </div>
      <span class="badge lock">скоро</span>
    </div>
  `;
}

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

    <div class="item">
      <div>
        <strong>Язык</strong>
        <div class="muted small">RU (следом добавим HE)</div>
      </div>
      <span class="badge lock">скоро</span>
    </div>

    <button class="btn btn--primary" id="goCourses">Открыть курсы</button>
  `;

  $("#goCourses")?.addEventListener("click", () => showTab("courses"));
}

// --- popup helper ---
function popup(title, message) {
  if (tg?.showPopup) {
    tg.showPopup({ title, message, buttons: [{ type: "ok" }] });
  } else {
    alert(`${title}\n\n${message}`);
  }
}

// --- Bind buttons on home ---
$("#openWash")?.addEventListener("click", () => {
  showTab("courses");
  renderCourseDetail("wash");
});
$("#previewWash")?.addEventListener("click", () => popup("Превью", "Сейчас включим урок → тест → прогресс. Уже работает 😉"));
$("#buyInterior")?.addEventListener("click", () => popup("Оплата", "Подключим Telegram Stars через бота на следующем этапе."));
$("#refInterior")?.addEventListener("click", () => showTab("bonus"));

// start
showTab("home");
