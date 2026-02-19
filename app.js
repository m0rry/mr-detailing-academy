/* MR Detailing Academy — Telegram WebApp SPA
   - Tabs: home/courses/progress/wiki/profile (+ course/lesson/test/admin)
   - Paid courses: locked until purchase (manual admin unlock OR Telegram invoice hook)
   - RU/HE UI
*/

(() => {
  "use strict";

  // ---------------------------
  // Telegram WebApp safe init
  // ---------------------------
  const tg = (window.Telegram && window.Telegram.WebApp) ? window.Telegram.WebApp : null;

  function safe(fn) {
    try { return fn(); } catch (e) { return null; }
  }

  if (tg) {
    safe(() => tg.ready());
    safe(() => tg.expand());
    safe(() => tg.setHeaderColor("#0b0f14"));
    safe(() => tg.setBackgroundColor("#0b0f14"));
  }

  // ---------------------------
  // Helpers
  // ---------------------------
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function clamp(n, a, b){ return Math.max(a, Math.min(b, n)); }
  function uid(prefix="id"){ return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`; }

  // ---------------------------
  // Storage
  // ---------------------------
  const LS_KEY = "mr_academy_state_v2";
  const state = loadState();

  function loadState() {
    const base = {
      lang: "ru",
      purchased: {},            // { courseId: { at: ISO, method: "manual|invoice|demo", invoiceId?: string } }
      progress: {},             // { lessonId: { done: true, test?: { passed: bool, score: number } } }
      profile: { name: null },
      admin: { unlocked: false }
    };
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return base;
      const parsed = JSON.parse(raw);
      return deepMerge(base, parsed);
    } catch {
      return base;
    }
  }

  function saveState() {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  }

  function deepMerge(a, b) {
    if (!b || typeof b !== "object") return a;
    const out = Array.isArray(a) ? a.slice() : { ...a };
    for (const k of Object.keys(b)) {
      if (b[k] && typeof b[k] === "object" && !Array.isArray(b[k])) {
        out[k] = deepMerge(out[k] ?? {}, b[k]);
      } else {
        out[k] = b[k];
      }
    }
    return out;
  }

  // ---------------------------
  // I18N (RU/HE)
  // ---------------------------
  const I18N = {
    ru: {
      brandSubtitle: "Внутренний мир детейлинга",
      greetingMorning: "Доброе утро,",
      greetingDay: "Добрый день,",
      greetingEvening: "Добрый вечер,",
      greetingNight: "Доброй ночи,",
      homeLead: "Курсы, тесты, база знаний и практические чек-листы — всё в одном месте.",
      openCourses: "Открыть курсы",
      openWiki: "Детейлинг-вики",
      quickTitle: "Быстрый старт",
      quickHint: "Если оплаты ещё нет — можно купить курс внутри вкладки “Курсы”.",
      openAfterWash: "Я оплатил / завершил мойку → открыть доступ",
      homeSectionTitle: "Рекомендуем сегодня",
      nav: { home:"Главная", courses:"Курсы", progress:"Прогресс", wiki:"Вики", profile:"Профиль" },
      coursesTitle: "Курсы",
      coursesSearch: "Поиск по курсам...",
      filterAll: "Все",
      filterFree: "Бесплатные",
      filterPaid: "Платные",
      filterOwned: "Доступные мне",
      progressTitle: "Прогресс",
      wikiTitle: "Детейлинг-вики",
      wikiSearch: "Поиск: полировка, PPF, керамика...",
      wikiAllCats: "Все категории",
      profileTitle: "Профиль",
      resetProgress: "Сбросить прогресс",
      exportData: "Экспорт данных",
      profileHint: "Админ-панель: 7 раз нажми на логотип “MR” сверху.",
      ownedTitle: "Мои доступы",
      back: "← Назад",
      adminTitle: "Админ",
      locked: "Закрыто",
      free: "Бесплатно",
      paid: "Платный",
      buy: "Купить доступ",
      open: "Открыть",
      continue: "Продолжить",
      lessons: "уроков",
      minutes: "мин",
      yourAccess: "Ваш доступ",
      accessGranted: "Доступ выдан",
      accessMissing: "Нет доступа",
      test: "Тест",
      startTest: "Начать тест",
      retakeTest: "Пересдать тест",
      passed: "Пройден",
      notPassed: "Не пройден",
      score: "Оценка",
      markDone: "Отметить урок как пройденный",
      done: "Готово",
      adminEnterPin: "Введите PIN администратора",
      adminPinPlaceholder: "PIN",
      adminLogin: "Войти",
      adminWrongPin: "Неверный PIN",
      adminPanel: "Панель управления",
      adminUnlockByCourse: "Выдать доступ к курсу пользователю (локально)",
      adminUnlockAll: "Открыть все курсы (локально)",
      adminLockAll: "Закрыть все курсы (локально)",
      adminSetPinInfo: "PIN задаётся в app.js: ADMIN_PIN",
      adminInvoiceHint: "Авто-оплата работает через Telegram invoice link (нужен бэкенд).",
      toastUnlocked: "Доступ открыт ✅",
      toastLocked: "Курс закрыт 🔒",
      toastSaved: "Сохранено ✅",
      toastReset: "Прогресс сброшен ✅",
      toastCopied: "Скопировано ✅",
      invoiceNotReady: "Сейчас нет invoice link. Используйте ручную выдачу или подключите бэкенд."
    },
    he: {
      brandSubtitle: "עולם הדיטלינג מבפנים",
      greetingMorning: "בוקר טוב,",
      greetingDay: "צהריים טובים,",
      greetingEvening: "ערב טוב,",
      greetingNight: "לילה טוב,",
      homeLead: "קורסים, מבחנים, בסיס ידע וצ׳ק-ליסטים מעשיים — הכול במקום אחד.",
      openCourses: "פתח קורסים",
      openWiki: "ויקי דיטלינג",
      quickTitle: "התחלה מהירה",
      quickHint: "אם עוד לא שילמת — אפשר לרכוש קורס בלשונית “קורסים”.",
      openAfterWash: "שילמתי / סיימתי שטיפה → לפתוח גישה",
      homeSectionTitle: "מומלץ להיום",
      nav: { home:"בית", courses:"קורסים", progress:"התקדמות", wiki:"ויקי", profile:"פרופיל" },
      coursesTitle: "קורסים",
      coursesSearch: "חיפוש קורסים...",
      filterAll: "הכול",
      filterFree: "חינמי",
      filterPaid: "בתשלום",
      filterOwned: "יש לי גישה",
      progressTitle: "התקדמות",
      wikiTitle: "ויקי דיטלינג",
      wikiSearch: "חיפוש: פוליש, PPF, קרמי...",
      wikiAllCats: "כל הקטגוריות",
      profileTitle: "פרופיל",
      resetProgress: "איפוס התקדמות",
      exportData: "ייצוא נתונים",
      profileHint: "פאנל אדמין: לחץ 7 פעמים על הלוגו “MR” למעלה.",
      ownedTitle: "הגישות שלי",
      back: "← חזרה",
      adminTitle: "אדמין",
      locked: "נעול",
      free: "חינמי",
      paid: "בתשלום",
      buy: "קנה גישה",
      open: "פתח",
      continue: "המשך",
      lessons: "שיעורים",
      minutes: "דק׳",
      yourAccess: "הגישה שלך",
      accessGranted: "גישה ניתנה",
      accessMissing: "אין גישה",
      test: "מבחן",
      startTest: "התחל מבחן",
      retakeTest: "מבחן חוזר",
      passed: "עבר",
      notPassed: "לא עבר",
      score: "ציון",
      markDone: "סמן שיעור כהושלם",
      done: "בוצע",
      adminEnterPin: "הזן PIN אדמין",
      adminPinPlaceholder: "PIN",
      adminLogin: "התחבר",
      adminWrongPin: "PIN שגוי",
      adminPanel: "לוח ניהול",
      adminUnlockByCourse: "תן גישה לקורס (מקומי)",
      adminUnlockAll: "פתח את כל הקורסים (מקומי)",
      adminLockAll: "נעל את כל הקורסים (מקומי)",
      adminSetPinInfo: "ה-PIN מוגדר ב-app.js: ADMIN_PIN",
      adminInvoiceHint: "תשלום אוטומטי עובד דרך Telegram invoice link (צריך שרת).",
      toastUnlocked: "גישה נפתחה ✅",
      toastLocked: "קורס נעול 🔒",
      toastSaved: "נשמר ✅",
      toastReset: "התקדמות אופסה ✅",
      toastCopied: "הועתק ✅",
      invoiceNotReady: "אין invoice link כרגע. השתמש במתן גישה ידני או חבר שרת."
    }
  };

  function t(keyPath) {
    const lang = state.lang in I18N ? state.lang : "ru";
    const dict = I18N[lang];
    const parts = keyPath.split(".");
    let cur = dict;
    for (const p of parts) {
      cur = cur?.[p];
      if (cur == null) return keyPath;
    }
    return cur;
  }

  function setLang(newLang) {
    state.lang = newLang === "he" ? "he" : "ru";
    saveState();
    applyI18n();
    renderAll();
  }

  // ---------------------------
  // Screens routing
  // ---------------------------
  const screens = ["home","courses","course","lesson","test","progress","wiki","profile","admin"];
  const screenEls = new Map(screens.map(s => [s, $(`#screen-${s}`)]));

  const navItems = $$(".nav__item");
  let current = { tab: "home", courseId: null, lessonId: null };

  function showScreen(tab) {
    if (!screenEls.has(tab)) tab = "home";
    screens.forEach(s => screenEls.get(s)?.classList.toggle("is-active", s === tab));
    navItems.forEach(btn => btn.classList.toggle("is-active", btn.dataset.tab === tab));
    current.tab = tab;
    safe(() => window.scrollTo({ top: 0, behavior: "instant" }));
  }

  // ---------------------------
  // Toast
  // ---------------------------
  let toastTimer = null;
  function toast(msg) {
    clearTimeout(toastTimer);
    let el = $("#toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "toast";
      el.style.position = "fixed";
      el.style.left = "50%";
      el.style.bottom = "86px";
      el.style.transform = "translateX(-50%)";
      el.style.padding = "10px 12px";
      el.style.borderRadius = "14px";
      el.style.border = "1px solid rgba(255,255,255,.12)";
      el.style.background = "rgba(10,14,20,.88)";
      el.style.backdropFilter = "blur(10px)";
      el.style.color = "rgba(234,242,255,.95)";
      el.style.fontWeight = "800";
      el.style.boxShadow = "0 12px 30px rgba(0,0,0,.45)";
      el.style.zIndex = "999";
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.style.opacity = "1";
    toastTimer = setTimeout(() => { el.style.opacity = "0"; }, 2200);
  }

  // ---------------------------
  // Access / Progress
  // ---------------------------
  function isOwned(courseId) {
    const course = getCourse(courseId);
    if (!course) return false;
    if (course.price === 0) return true;
    return Boolean(state.purchased[courseId]);
  }

  function grantAccess(courseId, method = "manual", invoiceId = null) {
    state.purchased[courseId] = { at: new Date().toISOString(), method, invoiceId: invoiceId || undefined };
    saveState();
    toast(t("toastUnlocked"));
    renderAll();
  }

  function revokeAllAccess() {
    state.purchased = {};
    saveState();
    renderAll();
  }

  function lessonDone(lessonId) {
    return Boolean(state.progress[lessonId]?.done);
  }

  function setLessonDone(lessonId, done = true) {
    state.progress[lessonId] = state.progress[lessonId] || {};
    state.progress[lessonId].done = done;
    saveState();
  }

  function setLessonTest(lessonId, passed, score) {
    state.progress[lessonId] = state.progress[lessonId] || {};
    state.progress[lessonId].test = { passed, score, at: new Date().toISOString() };
    saveState();
  }

  function getCourse(courseId) {
    return ACADEMY_DATA.courses.find(c => c.id === courseId) || null;
  }

  function getLesson(courseId, lessonId) {
    const course = getCourse(courseId);
    if (!course) return null;
    return course.lessons.find(l => l.id === lessonId) || null;
  }

  function courseProgress(courseId) {
    const course = getCourse(courseId);
    if (!course) return { done: 0, total: 0, pct: 0 };
    const total = course.lessons.length;
    const done = course.lessons.filter(l => lessonDone(l.id)).length;
    const pct = total ? Math.round((done / total) * 100) : 0;
    return { done, total, pct };
  }

  function globalProgress() {
    const allLessons = ACADEMY_DATA.courses.flatMap(c => c.lessons);
    const total = allLessons.length;
    const done = allLessons.filter(l => lessonDone(l.id)).length;
    const pct = total ? Math.round((done / total) * 100) : 0;
    return { done, total, pct };
  }

  // ---------------------------
  // Render: Home
  // ---------------------------
  function nowGreeting() {
    const h = new Date().getHours();
    if (h >= 5 && h < 12) return t("greetingMorning");
    if (h >= 12 && h < 18) return t("greetingDay");
    if (h >= 18 && h < 22) return t("greetingEvening");
    return t("greetingNight");
  }

  function renderHome() {
    $("#greeting").textContent = nowGreeting();

    // username
    const fromTg = tg ? (tg.initDataUnsafe?.user?.first_name || tg.initDataUnsafe?.user?.username) : null;
    const name = state.profile.name || fromTg || (state.lang === "he" ? "מאסטר" : "мастер");
    $("#username").textContent = name;
    $("#profileName").textContent = name;
    $("#profileMeta").textContent = tg ? `@${tg.initDataUnsafe?.user?.username || "telegram"} • WebApp` : "Browser mode";

    // stats
    const gp = globalProgress();
    const ownedCount = ACADEMY_DATA.courses.filter(c => isOwned(c.id)).length;
    const paidCount = ACADEMY_DATA.courses.filter(c => c.price > 0).length;
    $("#homeStats").innerHTML = `
      <div class="stat">
        <div class="stat__label">${state.lang === "he" ? "התקדמות כללית" : "Общий прогресс"}</div>
        <div class="stat__value">${gp.pct}%</div>
      </div>
      <div class="stat">
        <div class="stat__label">${state.lang === "he" ? "קורסים זמינים" : "Доступных курсов"}</div>
        <div class="stat__value">${ownedCount}</div>
      </div>
      <div class="stat">
        <div class="stat__label">${state.lang === "he" ? "קורסים בתשלום" : "Платных курсов"}</div>
        <div class="stat__value">${paidCount}</div>
      </div>
    `;

    // quick start list
    const quick = [
      state.lang === "he" ? "1) בחר קורס והתחל שיעור" : "1) Выбери курс и начни урок",
      state.lang === "he" ? "2) סיים שיעור וסמן כהושלם" : "2) Закончи урок и отметь как пройденный",
      state.lang === "he" ? "3) עבר מבחן לקבלת 100% בפרק" : "3) Пройди тест, чтобы закрепить знания",
    ];
    $("#quickList").innerHTML = quick.map(x => `<div class="list-item"><div class="list-item__title">${x}</div></div>`).join("");

    // recommended cards (top 3)
    const rec = ACADEMY_DATA.courses.slice(0, 3);
    $("#homeRecommended").innerHTML = rec.map(c => courseCardHTML(c)).join("");
    $$("#homeRecommended .card").forEach(card => {
      card.addEventListener("click", () => openCourse(card.dataset.id));
    });
  }

  // ---------------------------
  // Render: Courses
  // ---------------------------
  function courseCardHTML(course) {
    const owned = isOwned(course.id);
    const p = courseProgress(course.id);
    const priceLabel = course.price === 0 ? t("free") : `${course.price} ₪`;
    const lockBadge = owned ? `<span class="badge good">${t("accessGranted")}</span>` : `<span class="badge lock">${t("locked")}</span>`;
    const payBadge = course.price === 0 ? `<span class="badge good">${t("free")}</span>` : `<span class="badge pay">${t("paid")}</span>`;

    return `
      <div class="card" data-id="${course.id}">
        <div class="card__top">
          <div>
            <h3 class="card__title">${course.title[state.lang]}</h3>
            <p class="card__desc">${course.desc[state.lang]}</p>
          </div>
          <div class="badge">${priceLabel}</div>
        </div>

        <div class="badges">
          ${payBadge}
          <span class="badge">${course.level[state.lang]}</span>
          <span class="badge">${course.lessons.length} ${t("lessons")}</span>
          ${lockBadge}
        </div>

        <div style="margin-top:10px;">
          <div class="progressbar"><div style="width:${p.pct}%"></div></div>
          <div class="hint">${state.lang === "he" ? "הושלם" : "Пройдено"}: ${p.done}/${p.total} • ${p.pct}%</div>
        </div>
      </div>
    `;
  }

  function renderCourses() {
    const root = $("#coursesRoot");
    const q = ($("#coursesSearch").value || "").trim().toLowerCase();
    const filter = $("#coursesFilter").value;

    const list = ACADEMY_DATA.courses.filter(c => {
      const title = c.title[state.lang].toLowerCase();
      const desc = c.desc[state.lang].toLowerCase();
      const matchQ = !q || title.includes(q) || desc.includes(q);
      if (!matchQ) return false;

      const owned = isOwned(c.id);
      if (filter === "free") return c.price === 0;
      if (filter === "paid") return c.price > 0;
      if (filter === "owned") return owned;
      return true;
    });

    root.innerHTML = list.map(courseCardHTML).join("");

    $$("#coursesRoot .card").forEach(card => {
      card.addEventListener("click", () => openCourse(card.dataset.id));
    });
  }

  // ---------------------------
  // Render: Course details
  // ---------------------------
  function renderCourse(courseId) {
    const course = getCourse(courseId);
    if (!course) return;

    $("#courseTitle").textContent = course.title[state.lang];
    const owned = isOwned(courseId);
    const p = courseProgress(courseId);

    const priceLabel = course.price === 0 ? t("free") : `${course.price} ₪`;
    const accessLine = owned ? `<span class="badge good">${t("accessGranted")}</span>` : `<span class="badge lock">${t("accessMissing")}</span>`;

    const buyBtn = (!owned && course.price > 0)
      ? `<button class="btn btn-primary" id="buyCourseBtn">${t("buy")} • ${priceLabel}</button>
         <div class="hint">${t("adminInvoiceHint")}</div>`
      : "";

    const openBtn = owned
      ? `<button class="btn btn-secondary" id="continueCourseBtn">${t("continue")}</button>`
      : "";

    const lockedText = (!owned && course.price > 0)
      ? `<div class="result bad">
          <div class="result__title">${t("locked")} 🔒</div>
          <div class="result__text">${state.lang === "he"
            ? "כדי לפתוח — רכוש גישה או בקש ממנהל לתת גישה אחרי תשלום."
            : "Чтобы открыть — купи доступ или попроси администратора выдать доступ после оплаты."}</div>
        </div>`
      : "";

    $("#courseRoot").innerHTML = `
      <div class="panel">
        <div class="row" style="justify-content:space-between;">
          <div>
            <div class="kicker">${course.category[state.lang]}</div>
            <h2 style="margin:6px 0 6px;">${course.title[state.lang]}</h2>
            <div class="badges">
              <span class="badge">${priceLabel}</span>
              <span class="badge">${course.level[state.lang]}</span>
              <span class="badge">${course.lessons.length} ${t("lessons")}</span>
              ${accessLine}
            </div>
          </div>
        </div>

        <div style="margin-top:12px;">
          <div class="progressbar"><div style="width:${p.pct}%"></div></div>
          <div class="hint">${state.lang === "he" ? "הושלם" : "Пройдено"}: ${p.done}/${p.total} • ${p.pct}%</div>
        </div>

        <div class="hr"></div>

        <div class="row">
          ${buyBtn}
          ${openBtn}
        </div>

        ${lockedText}
      </div>

      <div class="panel">
        <h3 class="h3">${state.lang === "he" ? "שיעורים" : "Уроки"}</h3>
        <div class="list" id="lessonsList"></div>
      </div>
    `;

    // Lessons list
    const listEl = $("#lessonsList");
    listEl.innerHTML = course.lessons.map((l, idx) => {
      const done = lessonDone(l.id);
      const test = state.progress[l.id]?.test;
      const testBadge = l.test
        ? (test?.passed ? `<span class="badge good">${t("passed")}</span>` : `<span class="badge">${t("test")}</span>`)
        : "";

      const lock = (!owned && course.price > 0);
      return `
        <div class="list-item" data-lesson="${l.id}" style="${lock ? "opacity:.6" : ""}">
          <div>
            <div class="list-item__title">${idx + 1}. ${l.title[state.lang]}</div>
            <div class="list-item__meta">${l.durationMin} ${t("minutes")} • ${done ? "✅" : "⬜"} ${testBadge}</div>
          </div>
          <div class="badges">
            ${done ? `<span class="badge good">${t("done")}</span>` : ""}
            ${lock ? `<span class="badge lock">${t("locked")}</span>` : `<span class="badge">${t("open")}</span>`}
          </div>
        </div>
      `;
    }).join("");

    $$("#lessonsList .list-item").forEach(item => {
      item.addEventListener("click", () => {
        const lessonId = item.dataset.lesson;
        if (!owned && course.price > 0) {
          toast(t("toastLocked"));
          return;
        }
        openLesson(courseId, lessonId);
      });
    });

    // buy
    const buyBtnEl = $("#buyCourseBtn");
    if (buyBtnEl) {
      buyBtnEl.addEventListener("click", () => purchaseFlow(course));
    }

    // continue
    const cont = $("#continueCourseBtn");
    if (cont) {
      cont.addEventListener("click", () => {
        const next = course.lessons.find(l => !lessonDone(l.id)) || course.lessons[0];
        openLesson(courseId, next.id);
      });
    }
  }

  // ---------------------------
  // Purchase flow
  // ---------------------------
  async function purchaseFlow(course) {
    // 1) If invoiceUrl exists and Telegram supports openInvoice → try automatic
    if (tg && typeof tg.openInvoice === "function" && course.invoiceUrl) {
      try {
        tg.openInvoice(course.invoiceUrl, (status) => {
          // statuses: "paid", "cancelled", "failed", "pending"
          if (status === "paid") {
            grantAccess(course.id, "invoice", course.invoiceUrl);
          } else if (status === "cancelled") {
            toast(state.lang === "he" ? "בוטל" : "Отменено");
          } else if (status === "failed") {
            toast(state.lang === "he" ? "נכשל" : "Ошибка оплаты");
          } else {
            toast(state.lang === "he" ? "בהמתנה" : "В ожидании");
          }
        });
        return;
      } catch {
        // fallback below
      }
    }

    // 2) Demo fallback (client-only)
    // You can disable demo by setting ALLOW_DEMO_PURCHASE=false
    if (ACADEMY_DATA.settings.ALLOW_DEMO_PURCHASE) {
      const ok = confirm(state.lang === "he"
        ? `דמו: לפתוח גישה ל-“${course.title.he}” עכשיו?`
        : `Демо: открыть доступ к “${course.title.ru}” сейчас?`
      );
      if (ok) grantAccess(course.id, "demo", null);
      return;
    }

    toast(t("invoiceNotReady"));
  }

  // ---------------------------
  // Render: Lesson
  // ---------------------------
  function renderLesson(courseId, lessonId) {
    const lesson = getLesson(courseId, lessonId);
    const course = getCourse(courseId);
    if (!lesson || !course) return;

    $("#lessonTitle").textContent = lesson.title[state.lang];

    const done = lessonDone(lessonId);
    const test = state.progress[lessonId]?.test;

    const videoBlock = lesson.videoUrl
      ? `<div class="panel">
          <div class="h3">${state.lang === "he" ? "וידאו" : "Видео"}</div>
          <a href="${lesson.videoUrl}" target="_blank" rel="noreferrer">${state.lang === "he" ? "פתח קישור" : "Открыть ссылку"}</a>
        </div>`
      : "";

    const steps = lesson.steps?.[state.lang] || [];
    const stepsBlock = steps.length
      ? `<div class="panel">
          <div class="h3">${state.lang === "he" ? "שלבים" : "Шаги"}</div>
          <div class="list">
            ${steps.map(s => `<div class="list-item"><div class="list-item__title">${s}</div></div>`).join("")}
          </div>
        </div>`
      : "";

    const checklist = lesson.checklist?.[state.lang] || [];
    const checklistBlock = checklist.length
      ? `<div class="panel">
          <div class="h3">${state.lang === "he" ? "צ׳ק-ליסט" : "Чек-лист"}</div>
          <div class="list">
            ${checklist.map(s => `<div class="list-item"><div class="list-item__title">☑ ${s}</div></div>`).join("")}
          </div>
        </div>`
      : "";

    const text = lesson.text?.[state.lang] || "";
    const textBlock = text
      ? `<div class="panel">
          <div class="h3">${state.lang === "he" ? "תוכן" : "Контент"}</div>
          <div style="color:rgba(234,242,255,.92); line-height:1.55; white-space:pre-wrap;">${escapeHtml(text)}</div>
        </div>`
      : "";

    const testBtn = lesson.test
      ? `<button class="btn btn-primary" id="openTestBtn">${test?.passed ? t("retakeTest") : t("startTest")}</button>`
      : "";

    const markBtn = `<button class="btn btn-secondary" id="markDoneBtn">${t("markDone")}</button>`;

    const testInfo = lesson.test
      ? `<div class="result ${test?.passed ? "good" : ""}">
          <div class="result__title">${t("test")}</div>
          <div class="result__text">
            ${test
              ? `${t("score")}: <b>${test.score}%</b> • ${test.passed ? t("passed") : t("notPassed")}`
              : (state.lang === "he" ? "עדיין לא בוצע" : "Ещё не проходили")}
          </div>
        </div>`
      : "";

    $("#lessonRoot").innerHTML = `
      <div class="panel">
        <div class="kicker">${course.title[state.lang]}</div>
        <h2 style="margin:6px 0 6px;">${lesson.title[state.lang]}</h2>
        <div class="badges">
          <span class="badge">${lesson.durationMin} ${t("minutes")}</span>
          ${done ? `<span class="badge good">${t("done")}</span>` : `<span class="badge">${state.lang === "he" ? "לא הושלם" : "Не пройден"}</span>`}
        </div>

        <div class="hr"></div>

        <div class="row">
          ${testBtn}
          ${markBtn}
        </div>

        ${testInfo}
      </div>

      ${videoBlock}
      ${stepsBlock}
      ${checklistBlock}
      ${textBlock}
    `;

    const mark = $("#markDoneBtn");
    mark.addEventListener("click", () => {
      setLessonDone(lessonId, true);
      toast(t("toastSaved"));
      renderLesson(courseId, lessonId);
      renderAll(); // update progress
    });

    const openTest = $("#openTestBtn");
    if (openTest) openTest.addEventListener("click", () => openTestScreen(courseId, lessonId));
  }

  // ---------------------------
  // Render: Test
  // ---------------------------
  function renderTest(courseId, lessonId) {
    const lesson = getLesson(courseId, lessonId);
    if (!lesson?.test) return;

    $("#testTitle").textContent = `${t("test")} • ${lesson.title[state.lang]}`;

    const test = lesson.test;
    const prev = state.progress[lessonId]?.test;

    $("#testRoot").innerHTML = `
      <div class="panel">
        <div class="h3">${state.lang === "he" ? "בחר תשובות" : "Выберите ответы"}</div>
        <div class="hint">${state.lang === "he"
          ? "אחרי סיום — תקבל תוצאה ופתרונות."
          : "После завершения — получите результат и разбор."}</div>

        <div class="hr"></div>

        <form id="testForm"></form>

        <div class="hr"></div>

        <div class="row">
          <button class="btn btn-primary" id="submitTest" type="button">${state.lang === "he" ? "בדוק" : "Проверить"}</button>
          <button class="btn btn-ghost" id="clearTest" type="button">${state.lang === "he" ? "נקה" : "Очистить"}</button>
        </div>

        <div id="testResult" style="margin-top:12px;"></div>

        ${prev ? `<div class="hint" style="margin-top:10px;">${state.lang === "he" ? "תוצאה קודמת" : "Предыдущий результат"}: ${prev.score}%</div>` : ""}
      </div>
    `;

    const form = $("#testForm");
    form.innerHTML = test.questions.map((q, qi) => {
      const qId = `q_${qi}`;
      const opts = q.options[state.lang];
      return `
        <div class="q">
          <div class="q__title">${qi + 1}. ${q.text[state.lang]}</div>
          ${opts.map((opt, oi) => `
            <label class="opt">
              <input type="radio" name="${qId}" value="${oi}" />
              <span>${opt}</span>
            </label>
          `).join("")}
        </div>
      `;
    }).join("");

    $("#submitTest").addEventListener("click", () => {
      const answers = {};
      test.questions.forEach((q, qi) => {
        const qId = `q_${qi}`;
        const picked = form.querySelector(`input[name="${qId}"]:checked`);
        answers[qId] = picked ? Number(picked.value) : null;
      });

      const total = test.questions.length;
      let correct = 0;
      const breakdown = test.questions.map((q, qi) => {
        const picked = answers[`q_${qi}`];
        const ok = picked === q.correctIndex;
        if (ok) correct++;
        return { ok, picked, correct: q.correctIndex, q };
      });

      const score = Math.round((correct / total) * 100);
      const passed = score >= (test.passScore || 70);

      setLessonTest(lessonId, passed, score);
      if (passed) setLessonDone(lessonId, true);

      $("#testResult").innerHTML = `
        <div class="result ${passed ? "good" : "bad"}">
          <div class="result__title">${passed ? "✅ " + t("passed") : "❌ " + t("notPassed")}</div>
          <div class="result__text">${t("score")}: <b>${score}%</b> • ${state.lang === "he" ? "נכון" : "Верно"}: ${correct}/${total}</div>
        </div>
        <div class="panel" style="margin-top:12px;">
          <div class="h3">${state.lang === "he" ? "פתרונות" : "Разбор"}</div>
          <div class="list">
            ${breakdown.map((b, i) => {
              const opts = b.q.options[state.lang];
              const your = b.picked == null ? (state.lang === "he" ? "לא נבחר" : "не выбрано") : opts[b.picked];
              const right = opts[b.correct];
              return `
                <div class="list-item">
                  <div>
                    <div class="list-item__title">${b.ok ? "✅" : "❌"} ${i+1}. ${b.q.text[state.lang]}</div>
                    <div class="list-item__meta">${state.lang === "he" ? "שלך" : "Твой"}: ${escapeHtml(String(your))} • ${state.lang === "he" ? "נכון" : "Правильно"}: ${escapeHtml(String(right))}</div>
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        </div>
      `;

      renderAll(); // update progress everywhere
    });

    $("#clearTest").addEventListener("click", () => {
      $$("input[type=radio]", form).forEach(x => x.checked = false);
      $("#testResult").innerHTML = "";
    });
  }

  // ---------------------------
  // Render: Progress
  // ---------------------------
  function renderProgress() {
    const root = $("#progressRoot");
    const gp = globalProgress();

    const perCourse = ACADEMY_DATA.courses.map(c => {
      const p = courseProgress(c.id);
      return { c, p, owned: isOwned(c.id) };
    });

    root.innerHTML = `
      <div>
        <div class="row" style="justify-content:space-between;">
          <div>
            <div class="kicker">${state.lang === "he" ? "סיכום" : "Сводка"}</div>
            <div style="font-weight:900; font-size:22px; margin-top:6px;">${gp.pct}%</div>
            <div class="hint">${state.lang === "he" ? "שיעורים הושלמו" : "Уроков пройдено"}: ${gp.done}/${gp.total}</div>
          </div>
          <div style="min-width:180px;">
            <div class="progressbar"><div style="width:${gp.pct}%"></div></div>
          </div>
        </div>

        <div class="hr"></div>

        <div class="grid">
          ${perCourse.map(({c,p,owned}) => `
            <div class="card" data-id="${c.id}">
              <div class="card__top">
                <div>
                  <h3 class="card__title">${c.title[state.lang]}</h3>
                  <p class="card__desc">${c.category[state.lang]} • ${c.level[state.lang]}</p>
                </div>
                <div class="badge">${p.pct}%</div>
              </div>
              <div class="badges">
                <span class="badge">${p.done}/${p.total}</span>
                ${owned ? `<span class="badge good">${t("accessGranted")}</span>` : `<span class="badge lock">${t("locked")}</span>`}
              </div>
              <div style="margin-top:10px;" class="progressbar"><div style="width:${p.pct}%"></div></div>
            </div>
          `).join("")}
        </div>
      </div>
    `;

    $$("#progressRoot .card").forEach(card => {
      card.addEventListener("click", () => openCourse(card.dataset.id));
    });
  }

  // ---------------------------
  // Render: Wiki
  // ---------------------------
  function renderWiki() {
    const root = $("#wikiRoot");
    const q = ($("#wikiSearch").value || "").trim().toLowerCase();
    const cat = $("#wikiCategory").value;

    const items = ACADEMY_DATA.wiki.filter(w => {
      const matchCat = (cat === "all") || (w.categoryKey === cat);
      if (!matchCat) return false;
      const title = w.title[state.lang].toLowerCase();
      const body = w.body[state.lang].toLowerCase();
      return !q || title.includes(q) || body.includes(q);
    });

    root.innerHTML = items.map(w => `
      <div class="card" data-id="${w.id}">
        <div class="card__top">
          <div>
            <h3 class="card__title">${w.title[state.lang]}</h3>
            <p class="card__desc">${w.preview[state.lang]}</p>
          </div>
          <div class="badge">${w.category[state.lang]}</div>
        </div>
        <div class="badges">
          ${w.tags[state.lang].slice(0,4).map(tag => `<span class="badge">${tag}</span>`).join("")}
        </div>
      </div>
    `).join("");

    $$("#wikiRoot .card").forEach(card => {
      card.addEventListener("click", () => openWikiItem(card.dataset.id));
    });
  }

  function openWikiItem(id) {
    const w = ACADEMY_DATA.wiki.find(x => x.id === id);
    if (!w) return;

    // reuse "course" screen for article view (simple)
    $("#courseTitle").textContent = w.title[state.lang];
    $("#courseRoot").innerHTML = `
      <div class="panel">
        <div class="badges">
          <span class="badge">${w.category[state.lang]}</span>
          ${w.tags[state.lang].slice(0,6).map(tag => `<span class="badge">${tag}</span>`).join("")}
        </div>
        <div class="hr"></div>
        <div style="line-height:1.6; white-space:pre-wrap;">${escapeHtml(w.body[state.lang])}</div>
      </div>
    `;

    showScreen("course");
    current.courseId = null;
    current.lessonId = null;
  }

  function buildWikiCategories() {
    const select = $("#wikiCategory");
    const unique = new Map();
    ACADEMY_DATA.wiki.forEach(w => unique.set(w.categoryKey, w.category));
    select.innerHTML = `<option value="all">${t("wikiAllCats")}</option>` +
      Array.from(unique.entries()).map(([key, name]) => `<option value="${key}">${name[state.lang]}</option>`).join("");
  }

  // ---------------------------
  // Render: Profile & Owned
  // ---------------------------
  function renderProfile() {
    const ownedRoot = $("#ownedRoot");
    const owned = ACADEMY_DATA.courses.filter(c => isOwned(c.id));

    ownedRoot.innerHTML = owned.length ? `
      <div class="list">
        ${owned.map(c => `
          <div class="list-item" data-id="${c.id}">
            <div>
              <div class="list-item__title">${c.title[state.lang]}</div>
              <div class="list-item__meta">${c.price === 0 ? t("free") : `${c.price} ₪`} • ${c.category[state.lang]}</div>
            </div>
            <div class="badges">
              <span class="badge good">${t("open")}</span>
            </div>
          </div>
        `).join("")}
      </div>
    ` : `<div class="hint">${state.lang === "he" ? "עדיין אין גישות." : "Пока нет доступов."}</div>`;

    $$("#ownedRoot .list-item").forEach(item => {
      item.addEventListener("click", () => openCourse(item.dataset.id));
    });

    // avatar
    const initials = "MR";
    $("#profileAvatar").textContent = initials;
  }

  // ---------------------------
  // Admin panel
  // ---------------------------
  const ADMIN_PIN = "7777"; // <-- поменяй на свой PIN
  let brandTapCount = 0;
  let brandTapTimer = null;

  function openAdmin() {
    showScreen("admin");
    renderAdmin();
  }

  function renderAdmin() {
    const root = $("#adminRoot");
    const isLogged = state.admin.unlocked;

    if (!isLogged) {
      root.innerHTML = `
        <div class="panel" style="padding:0; background:transparent; border:none; box-shadow:none;">
          <h2 style="margin:0 0 8px;">${t("adminEnterPin")}</h2>
          <div class="row">
            <input class="input" id="adminPin" placeholder="${t("adminPinPlaceholder")}" />
            <button class="btn btn-primary" id="adminLoginBtn">${t("adminLogin")}</button>
          </div>
          <div class="hint">${t("adminSetPinInfo")}</div>
        </div>
      `;

      $("#adminLoginBtn").addEventListener("click", () => {
        const v = ($("#adminPin").value || "").trim();
        if (v === ADMIN_PIN) {
          state.admin.unlocked = true;
          saveState();
          toast(t("toastUnlocked"));
          renderAdmin();
        } else {
          toast(t("adminWrongPin"));
        }
      });
      return;
    }

    root.innerHTML = `
      <div class="panel">
        <h2 style="margin:0 0 8px;">${t("adminPanel")}</h2>
        <div class="hint">${t("adminInvoiceHint")}</div>
        <div class="hr"></div>

        <div class="h3">${t("adminUnlockByCourse")}</div>
        <div class="row" style="margin-bottom:10px;">
          <select class="select" id="adminCourseSelect">
            ${ACADEMY_DATA.courses.filter(c => c.price > 0).map(c => `<option value="${c.id}">${c.title[state.lang]} (${c.price}₪)</option>`).join("")}
          </select>
          <button class="btn btn-secondary" id="adminGrantBtn">${state.lang === "he" ? "תן גישה" : "Выдать доступ"}</button>
        </div>

        <div class="row">
          <button class="btn btn-primary" id="adminUnlockAll">${t("adminUnlockAll")}</button>
          <button class="btn btn-ghost" id="adminLockAll">${t("adminLockAll")}</button>
        </div>
      </div>

      <div class="panel" style="margin-top:12px;">
        <div class="h3">${state.lang === "he" ? "סטטוס רכישות (מקומי)" : "Статус покупок (локально)"}</div>
        <div class="code" id="adminDump"></div>
        <div class="row" style="margin-top:10px;">
          <button class="btn btn-secondary" id="copyDump">${state.lang === "he" ? "העתק" : "Копировать"}</button>
          <button class="btn btn-ghost" id="logoutAdmin">${state.lang === "he" ? "התנתק" : "Выйти"}</button>
        </div>
      </div>
    `;

    $("#adminDump").textContent = JSON.stringify({ purchased: state.purchased }, null, 2);

    $("#adminGrantBtn").addEventListener("click", () => {
      const courseId = $("#adminCourseSelect").value;
      grantAccess(courseId, "manual", null);
      renderAdmin();
    });

    $("#adminUnlockAll").addEventListener("click", () => {
      ACADEMY_DATA.courses.filter(c => c.price > 0).forEach(c => grantAccess(c.id, "manual"));
      renderAdmin();
    });

    $("#adminLockAll").addEventListener("click", () => {
      revokeAllAccess();
      toast(state.lang === "he" ? "ננעל" : "Закрыто");
      renderAdmin();
    });

    $("#copyDump").addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText($("#adminDump").textContent);
        toast(t("toastCopied"));
      } catch {
        toast(state.lang === "he" ? "לא ניתן להעתיק" : "Не удалось скопировать");
      }
    });

    $("#logoutAdmin").addEventListener("click", () => {
      state.admin.unlocked = false;
      saveState();
      renderAdmin();
    });
  }

  // ---------------------------
  // Navigation actions
  // ---------------------------
  function openCourse(courseId) {
    const course = getCourse(courseId);
    if (!course) return;
    current.courseId = courseId;
    current.lessonId = null;
    showScreen("course");
    renderCourse(courseId);
  }

  function openLesson(courseId, lessonId) {
    current.courseId = courseId;
    current.lessonId = lessonId;
    showScreen("lesson");
    renderLesson(courseId, lessonId);
  }

  function openTestScreen(courseId, lessonId) {
    current.courseId = courseId;
    current.lessonId = lessonId;
    showScreen("test");
    renderTest(courseId, lessonId);
  }

  // ---------------------------
  // Apply i18n to static UI
  // ---------------------------
  function applyI18n() {
    $("#brandSubtitle").textContent = t("brandSubtitle");
    $("#homeLead").textContent = t("homeLead");
    $("#openCourses").textContent = t("openCourses");
    $("#openWiki").textContent = t("openWiki");
    $("#quickTitle").textContent = t("quickTitle");
    $("#quickHint").textContent = t("quickHint");
    $("#openWash").textContent = t("openAfterWash");
    $("#homeSectionTitle").textContent = t("homeSectionTitle");

    $("#coursesTitle").textContent = t("coursesTitle");
    $("#coursesSearch").setAttribute("placeholder", t("coursesSearch"));
    $("#progressTitle").textContent = t("progressTitle");

    $("#wikiTitle").textContent = t("wikiTitle");
    $("#wikiSearch").setAttribute("placeholder", t("wikiSearch"));

    $("#profileTitle").textContent = t("profileTitle");
    $("#resetProgress").textContent = t("resetProgress");
    $("#exportData").textContent = t("exportData");
    $("#profileHint").textContent = t("profileHint");
    $("#ownedTitle").textContent = t("ownedTitle");

    $("#navHome").textContent = t("nav.home");
    $("#navCourses").textContent = t("nav.courses");
    $("#navProgress").textContent = t("nav.progress");
    $("#navWiki").textContent = t("nav.wiki");
    $("#navProfile").textContent = t("nav.profile");

    $("#adminTitle").textContent = t("adminTitle");

    // filters labels
    const f = $("#coursesFilter");
    if (f) {
      f.options[0].text = t("filterAll");
      f.options[1].text = t("filterFree");
      f.options[2].text = t("filterPaid");
      f.options[3].text = t("filterOwned");
    }
  }

  // ---------------------------
  // Render all
  // ---------------------------
  function renderAll() {
    renderHome();
    renderCourses();
    renderProgress();
    buildWikiCategories();
    renderWiki();
    renderProfile();
    if (current.tab === "course" && current.courseId) renderCourse(current.courseId);
    if (current.tab === "lesson" && current.courseId && current.lessonId) renderLesson(current.courseId, current.lessonId);
    if (current.tab === "test" && current.courseId && current.lessonId) renderTest(current.courseId, current.lessonId);
    if (current.tab === "admin") renderAdmin();
  }

  // ---------------------------
  // Events
  // ---------------------------
  function bindEvents() {
    // nav tabs
    navItems.forEach(btn => {
      btn.addEventListener("click", () => {
        const tab = btn.dataset.tab;
        showScreen(tab);
        renderAll();
      });
    });

    // close
    $("#closeBtn").addEventListener("click", () => {
      if (tg) safe(() => tg.close());
      else toast(state.lang === "he" ? "אין Telegram" : "Нет Telegram WebApp");
    });

    // lang toggle
    $("#langToggle").addEventListener("click", () => {
      const next = state.lang === "ru" ? "he" : "ru";
      setLang(next);
      $("#langToggle").textContent = next.toUpperCase();
    });
    $("#langToggle").textContent = state.lang.toUpperCase();

    // home quick buttons
    $("#openCourses").addEventListener("click", () => { showScreen("courses"); renderAll(); });
    $("#openWiki").addEventListener("click", () => { showScreen("wiki"); renderAll(); });

    // manual unlock button (like "after wash")
    $("#openWash").addEventListener("click", () => {
      // Fast: unlock "Foundation" paid course by default, or all if you want
      // Здесь ты решаешь бизнес-логику. Я сделал: открываем "foundation_paid" (пример).
      const defaultCourse = ACADEMY_DATA.courses.find(c => c.unlockOnWash === true);
      if (defaultCourse) {
        grantAccess(defaultCourse.id, "manual");
      } else {
        // fallback: open first paid course
        const firstPaid = ACADEMY_DATA.courses.find(c => c.price > 0);
        if (firstPaid) grantAccess(firstPaid.id, "manual");
      }
    });

    // search/filter courses
    $("#coursesSearch").addEventListener("input", renderCourses);
    $("#coursesFilter").addEventListener("change", renderCourses);

    // wiki search
    $("#wikiSearch").addEventListener("input", renderWiki);
    $("#wikiCategory").addEventListener("change", renderWiki);

    // back buttons
    $("#backToCourses").addEventListener("click", () => { showScreen("courses"); renderAll(); });
    $("#backToCourse").addEventListener("click", () => { showScreen("course"); if (current.courseId) renderCourse(current.courseId); });
    $("#backToLesson").addEventListener("click", () => { showScreen("lesson"); if (current.courseId && current.lessonId) renderLesson(current.courseId, current.lessonId); });
    $("#backFromAdmin").addEventListener("click", () => { showScreen("profile"); renderAll(); });

    // profile actions
    $("#resetProgress").addEventListener("click", () => {
      const ok = confirm(state.lang === "he" ? "לאפס את ההתקדמות?" : "Сбросить прогресс?");
      if (!ok) return;
      state.progress = {};
      saveState();
      toast(t("toastReset"));
      renderAll();
    });

    $("#exportData").addEventListener("click", async () => {
      const payload = JSON.stringify({ state, exportedAt: new Date().toISOString() }, null, 2);
      try {
        await navigator.clipboard.writeText(payload);
        toast(t("toastCopied"));
      } catch {
        // if clipboard blocked, show in alert
        alert(payload);
      }
    });

    // admin easter: 7 taps on logo
    $("#brandTap").addEventListener("click", () => {
      brandTapCount += 1;
      clearTimeout(brandTapTimer);
      brandTapTimer = setTimeout(() => { brandTapCount = 0; }, 1200);
      if (brandTapCount >= 7) {
        brandTapCount = 0;
        openAdmin();
      }
    });
  }

  // ---------------------------
  // Utils
  // ---------------------------
  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  // ---------------------------
  // Boot
  // ---------------------------
  function boot() {
    // language
    if (!["ru","he"].includes(state.lang)) state.lang = "ru";
    $("#langToggle").textContent = state.lang.toUpperCase();
    applyI18n();

    // default screen
    showScreen("home");

    // data-driven categories
    buildWikiCategories();

    // bind
    bindEvents();

    // initial render
    renderAll();
  }

  document.addEventListener("DOMContentLoaded", boot);

  // ---------------------------
  // CONTENT / DATA (edit here)
  // ---------------------------
  const ACADEMY_DATA = {
    settings: {
      // Демо-покупка (без бэка). Когда подключишь оплату — поставь false.
      ALLOW_DEMO_PURCHASE: true
    },

    courses: [
      {
        id: "intro_free",
        price: 0,
        unlockOnWash: false,
        category: { ru: "База", he: "בסיס" },
        level: { ru: "Новичок", he: "מתחיל" },
        title: { ru: "Введение в детейлинг", he: "מבוא לדיטלינג" },
        desc: {
          ru: "Термины, подходы, безопасная мойка и философия качества.",
          he: "מושגים, גישה מקצועית, שטיפה בטוחה ופילוסופיית איכות."
        },
        invoiceUrl: null, // бесплатный
        lessons: [
          {
            id: "l_intro_1",
            durationMin: 8,
            title: { ru: "Что такое детейлинг и зачем он нужен", he: "מה זה דיטלינג ולמה זה חשוב" },
            steps: {
              ru: ["Детейлинг ≠ мойка", "Цель — сохранить ЛКП/салон", "Системность и контроль риска"],
              he: ["דיטלינג ≠ שטיפה", "מטרה — לשמור על צבע/פנים", "שיטתיות וניהול סיכונים"]
            },
            checklist: {
              ru: ["Всегда начинай с оценки состояния", "Фиксируй дефекты фото/видео", "Работай по плану"],
              he: ["תמיד להתחיל בהערכת מצב", "לתעד פגמים", "לעבוד לפי תכנית"]
            },
            text: {
              ru: "Детейлинг — это набор процедур по восстановлению и защите автомобиля.\nКлюч: минимальный риск, повторяемый результат и правильная химия/инструменты.",
              he: "דיטלינג הוא סט פעולות לשיקום והגנה על הרכב.\nהמפתח: מינימום סיכון, תוצאה עקבית וכימיה/כלים נכונים."
            },
            test: {
              passScore: 70,
              questions: [
                {
                  text: { ru: "Главная цель детейлинга:", he: "המטרה העיקרית של דיטלינג:" },
                  options: {
                    ru: ["Сделать быстро", "Сохранить/улучшить состояние с контролем риска", "Только блеск"],
                    he: ["לעשות מהר", "לשמר/לשפר מצב עם ניהול סיכונים", "רק ברק"]
                  },
                  correctIndex: 1
                }
              ]
            }
          },
          {
            id: "l_intro_2",
            durationMin: 10,
            title: { ru: "Безопасная мойка: базовый алгоритм", he: "שטיפה בטוחה: אלגוריתם בסיסי" },
            steps: {
              ru: ["Предварительная пена", "Два ведра/минимизация контакта", "Сушка без царапин"],
              he: ["קצף מקדים", "שתי דליים/מינימום מגע", "ייבוש ללא שריטות"]
            },
            checklist: {
              ru: ["Чистая рукавица", "Сепаратор (grit guard)", "Чистые полотенца"],
              he: ["כפפה נקייה", "Grit Guard", "מגבות נקיות"]
            },
            text: {
              ru: "Самое дорогое — не химия, а ошибки. Ошибка мойки = паутинка на лаке.",
              he: "הכי יקר זה לא הכימיה — זה טעויות. טעות שטיפה = סווירלים בצבע."
            },
            test: null
          }
        ]
      },

      {
        id: "foundation_paid",
        price: 199,
        unlockOnWash: true,
        category: { ru: "Практика", he: "פרקטיקה" },
        level: { ru: "База+", he: "בסיס+" },
        title: { ru: "Фундамент мастера: мойка → деконтаминация → защита", he: "בסיס מאסטר: שטיפה → דה-קונטמינציה → הגנה" },
        desc: {
          ru: "Полный цикл подготовки кузова: что, чем и в каком порядке. Ошибки, риски, нормы расхода.",
          he: "מחזור מלא להכנת צבע: מה, עם מה ובאיזה סדר. טעויות, סיכונים ונורמות שימוש."
        },
        invoiceUrl: null, // сюда вставишь invoice link от твоего сервера
        lessons: [
          {
            id: "l_found_1",
            durationMin: 14,
            title: { ru: "Деконтаминация: айрон, битум, глина", he: "דה-קונטמינציה: איירון, זפת, קליי" },
            steps: {
              ru: ["Айрон по дискам/кузову", "Битум точечно", "Глина с лубрикантом"],
              he: ["איירון לחישוקים/צבע", "זפת נקודתית", "קליי עם לובריקנט"]
            },
            checklist: {
              ru: ["Не работай на горячей панели", "Смывай вовремя", "Не дави глиной"],
              he: ["לא לעבוד על פאנל חם", "לשטוף בזמן", "לא ללחוץ עם קליי"]
            },
            text: {
              ru: "Порядок важен: сначала химическая деконтаминация, потом механика (глина).",
              he: "הסדר חשוב: קודם דה-קונטמינציה כימית, אחר כך מכנית (קליי)."
            },
            test: {
              passScore: 70,
              questions: [
                {
                  text: { ru: "Что делаем первым?", he: "מה עושים קודם?" },
                  options: {
                    ru: ["Глина", "Айрон/битум (химия)", "Полировка"],
                    he: ["קליי", "איירון/זפת (כימיה)", "פוליש"]
                  },
                  correctIndex: 1
                }
              ]
            }
          },
          {
            id: "l_found_2",
            durationMin: 16,
            title: { ru: "Защиты: воск, силанты, керамика — чем отличаются", he: "הגנות: וקס, סילנט, קרמי — מה ההבדל" },
            steps: {
              ru: ["Подготовка поверхности", "Нанесение по инструкции", "Уход после нанесения"],
              he: ["הכנת פני שטח", "יישום לפי הוראות", "תחזוקה לאחר יישום"]
            },
            checklist: {
              ru: ["Обезжиривание (IPA) по необходимости", "Чистые аппликаторы", "Правильная выдержка"],
              he: ["ניקוי שומנים (IPA) לפי צורך", "אפליקטורים נקיים", "זמן התקשות נכון"]
            },
            text: {
              ru: "Воск — быстро и красиво, но недолго.\nСилант — дольше и стабильнее.\nКерамика — максимальная стойкость при правильной подготовке.",
              he: "וקס — מהיר ויפה אבל פחות עמיד.\nסילנט — עמיד יותר.\nקרמי — עמידות מקסימלית עם הכנה נכונה."
            },
            test: null
          }
        ]
      },

      {
        id: "polish_pro_paid",
        price: 349,
        unlockOnWash: false,
        category: { ru: "Полировка", he: "פוליש" },
        level: { ru: "Профи", he: "מתקדם" },
        title: { ru: "Полировка PRO: круги, пасты, техника, риски", he: "פוליש PRO: פדים, פסטות, טכניקה, סיכונים" },
        desc: {
          ru: "Как читать лак, как не прожечь, как убирать риску 2000/3000 и не ловить голограммы.",
          he: "איך לקרוא לכה, איך לא לשרוף, איך להסיר סימני 2000/3000 בלי הולוגרמות."
        },
        invoiceUrl: null, // вставишь invoice link с бэка
        lessons: [
          {
            id: "l_pol_1",
            durationMin: 18,
            title: { ru: "Орбитальная vs роторная: контроль риска", he: "אורביטל מול רוטרי: ניהול סיכון" },
            steps: {
              ru: ["Скорость и давление", "Температура панели", "Чистка круга"],
              he: ["מהירות ולחץ", "טמפרטורת פאנל", "ניקוי פד"]
            },
            checklist: {
              ru: ["Замер толщины (если есть)", "Тест-спот", "Лента по кромкам"],
              he: ["מד עובי (אם יש)", "טסט-ספוט", "טייפ על קצוות"]
            },
            text: {
              ru: "PRO-подход: минимально агрессивная связка, но достаточно эффективная.\nТест-спот решает всё.",
              he: "גישה מקצועית: השילוב הכי פחות אגרסיבי אבל יעיל.\nטסט-ספוט זה הכול."
            },
            test: null
          }
        ]
      }
    ],

    wiki: [
      {
        id: "w_ppf",
        categoryKey: "paint_protection",
        category: { ru: "Защита", he: "הגנה" },
        title: { ru: "PPF: полиуретановая плёнка", he: "PPF: סרט פוליאוריטן" },
        preview: {
          ru: "Что защищает, как клеится, уход, ошибки и срок службы.",
          he: "מה זה מגן, איך מדביקים, תחזוקה, טעויות ואורך חיים."
        },
        tags: {
          ru: ["PPF", "плёнка", "защита", "камни"],
          he: ["PPF", "סרט", "הגנה", "אבנים"]
        },
        body: {
          ru: "PPF (Paint Protection Film) — прозрачная полиуретановая плёнка для защиты ЛКП.\n\nГлавные плюсы:\n• защита от сколов/пескоструя\n• само-восстановление мелких царапин (на части плёнок)\n• легче поддерживать чистоту\n\nМинусы:\n• цена и трудоемкость\n• важна подготовка поверхности\n\nУход:\n• мягкая химия\n• избегать агрессивных растворителей\n• регулярная мойка и сушка",
          he: "PPF הוא סרט פוליאוריטן שקוף להגנת הצבע.\n\nיתרונות:\n• הגנה מפגיעות/אבנים\n• התאוששות שריטות קלות בחלק מהסרטים\n• תחזוקה קלה יותר\n\nחסרונות:\n• מחיר ועבודה מורכבת\n• הכנה נכונה קריטית\n\nתחזוקה:\n• כימיה עדינה\n• להימנע מממסים חזקים\n• שטיפה וייבוש קבועים"
        }
      },
      {
        id: "w_iron",
        categoryKey: "chemistry",
        category: { ru: "Химия", he: "כימיה" },
        title: { ru: "Айрон-ремувер: как работает", he: "איירון רימובר: איך זה עובד" },
        preview: {
          ru: "Что такое 'кровоточащая' реакция, где применять и что нельзя делать.",
          he: "מה זו תגובת 'דימום', איפה להשתמש וממה להיזהר."
        },
        tags: {
          ru: ["айрон", "диски", "металлические вкрапления"],
          he: ["איירון", "חישוקים", "חלקיקי מתכת"]
        },
        body: {
          ru: "Айрон-ремувер растворяет металлические вкрапления.\nРеакция фиолетового цвета — нормальная.\n\nПравила:\n• не на горячей поверхности\n• не давать высохнуть\n• тщательно смывать\n\nЧасто используют по дискам и по кузову перед глиной.",
          he: "איירון רימובר ממיס חלקיקי מתכת.\nהתגובה הסגולה היא תקינה.\n\nכללים:\n• לא על משטח חם\n• לא לתת להתייבש\n• לשטוף היטב\n\nמשתמשים הרבה על חישוקים ועל הצבע לפני קליי."
        }
      }
    ]
  };

})();
