/* MR Detailing Academy — Telegram WebApp SPA
   Tabs: home/courses/progress/wiki/profile (+ course/lesson/test/admin)
   Paid courses: locked until purchase (manual admin unlock OR Telegram invoice hook)
   RU/HE UI + RTL + RSS News
*/
(() => {
  "use strict";

  // ---------------------------
  // Telegram WebApp safe init
  // ---------------------------
  const tg = (window.Telegram && window.Telegram.WebApp) ? window.Teleram?.WebApp : null; // (safe if Telegram missing)
  // Fix: the line above could be typo if Telegram exists; ensure proper fallback:
  const tgSafe = (window.Telegram && window.Telegram.WebApp) ? window.Telegram.WebApp : null;

  function safe(fn) {
    try { return fn(); } catch (e) { return null; }
  }

  if (tgSafe) {
    safe(() => tgSafe.ready());
    safe(() => tgSafe.expand());
    safe(() => tgSafe.setHeaderColor("#0b0f14"));
    safe(() => tgSafe.setBackgroundColor("#0b0f14"));
  }

  // ---------------------------
  // Helpers
  // ---------------------------
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }
  function uid(prefix = "id") { return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`; }

  // ---------------------------
  // Storage
  // ---------------------------
  const LS_KEY = "mr_academy_state_v2";
  const state = loadState();

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

  function loadState() {
    const base = {
      lang: "ru",
      purchased: {}, // { courseId: { at: ISO, method: "manual|invoice|demo", invoiceId?: string } }
      progress: {},  // { lessonId: { done: true, test?: { passed: bool, score: number } } }
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

      // NEWS
      newsTitle: "Новости",
      newsRefresh: "Обновить",
      newsEmpty: "Пока нет новостей — нажми «Обновить»",

      nav: { home: "Главная", courses: "Курсы", progress: "Прогресс", wiki: "Вики", profile: "Профиль" },
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
      toastLocked: "Курс закрыт ",
      toastSaved: "Сохранено ✅",
      toastReset: "Прогресс сброшен ✅",
      toastCopied: "Скопировано ✅",
      invoiceNotReady: "Сейчас нет invoice link.\nИспользуйте ручную выдачу или подключите бэкенд."
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

      // NEWS
      newsTitle: "חדשות",
      newsRefresh: "רענן",
      newsEmpty: "אין חדשות עדיין — לחץ על “רענן”",

      nav: { home: "בית", courses: "קורסים", progress: "התקדמות", wiki: "ויקי", profile: "פרופיל" },
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
      toastLocked: "קורס נעול ",
      toastSaved: "נשמר ✅",
      toastReset: "התקדמות אופסה ✅",
      toastCopied: "הועתק ✅",
      invoiceNotReady: "אין invoice link כרגע.\nהשתמש במתן גישה ידני או חבר שרת."
    }
  };

  function t(keyPath) {
    const lang = (state.lang in I18N) ? state.lang : "ru";
    const dict = I18N[lang];
    const parts = keyPath.split(".");
    let cur = dict;
    for (const p of parts) {
      cur = cur?.[p];
      if (cur == null) return keyPath;
    }
    return cur;
  }

  function applyLangDir() {
    const lang = (state.lang === "he") ? "he" : "ru";
    document.documentElement.lang = lang;
    document.documentElement.dir = (lang === "he") ? "rtl" : "ltr";
    document.body.classList.toggle("is-he", lang === "he");
  }

  function setLang(newLang) {
    state.lang = (newLang === "he") ? "he" : "ru";
    saveState();
    applyLangDir();
    applyI18n();
    renderAll();
  }

  // ---------------------------
  // Screens routing
  // ---------------------------
  const screens = ["home", "courses", "course", "lesson", "test", "progress", "wiki", "profile", "admin"];
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
  function getCourse(courseId) {
    return ACADEMY_DATA.courses.find(c => c.id === courseId) || null;
  }
  function getLesson(courseId, lessonId) {
    const course = getCourse(courseId);
    if (!course) return null;
    return course.lessons.find(l => l.id === lessonId) || null;
  }

  function isOwned(courseId) {
    const course = getCourse(courseId);
    if (!course) return false;
    if (course.price === 0) return true;
    return Boolean(state.purchased[courseId]);
  }

  function grantAccess(courseId, method = "manual", invoiceId = null) {
    state.purchased[courseId] = {
      at: new Date().toISOString(),
      method,
      invoiceId: invoiceId || undefined
    };
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
  // RSS NEWS (Home)
  // ---------------------------
  const NEWS_LS_KEY = "mr_academy_news_cache_v1";

  const NEWS_FEEDS = [
    { id: "autogeek", name: "Autogeek", url: "https://www.autogeekonline.net/feed/" },
    { id: "detailedimage", name: "Detailed Image", url: "https://www.detailedimage.com/Ask-a-Pro/feed/" }
  ];

  function loadNewsCache() {
    try {
      const raw = localStorage.getItem(NEWS_LS_KEY);
      if (!raw) return { at: 0, items: [] };
      const parsed = JSON.parse(raw);
      return { at: parsed.at || 0, items: Array.isArray(parsed.items) ? parsed.items : [] };
    } catch {
      return { at: 0, items: [] };
    }
  }

  function saveNewsCache(items) {
    localStorage.setItem(NEWS_LS_KEY, JSON.stringify({ at: Date.now(), items }));
  }

  async function fetchFeedItems(feedUrl) {
    // NOTE: RSS usually blocked by CORS → rss2json proxy
    const api = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`;
    const res = await fetch(api, { cache: "no-store" });
    if (!res.ok) throw new Error("RSS fetch failed");
    const data = await res.json();
    const items = Array.isArray(data.items) ? data.items : [];
    return items.map(it => ({
      id: it.guid || it.link || uid("news"),
      title: it.title || "",
      link: it.link || "",
      pubDate: it.pubDate || "",
      source: data.feed?.title || "",
      image: it.thumbnail || it.enclosure?.link || "",
      desc: (it.description || "").replace(/<[^>]*>/g, "").trim().slice(0, 220)
    }));
  }

  function renderNews(items) {
    const root = $("#newsRoot");
    if (!root) return; // если в index.html нет секции новостей — просто пропустим

    if (!items || !items.length) {
      root.innerHTML = "";
      const hint = $("#newsHint");
      if (hint) hint.textContent = t("newsEmpty");
      return;
    }

    root.innerHTML = items.map(n => `
      <article class="card" data-link="${escapeHtml(n.link)}">
        <div class="card__body">
          <div class="card__meta">
            <span class="chip">${escapeHtml(n.source || "News")}</span>
            <span class="muted">${escapeHtml((n.pubDate || "").slice(0, 16).replace("T", " "))}</span>
          </div>
          <h3 class="card__title">${escapeHtml(n.title)}</h3>
          <p class="card__desc">${escapeHtml(n.desc || "")}</p>
        </div>
      </article>
    `).join("");

    $$("#newsRoot .card").forEach(card => {
      card.addEventListener("click", () => {
        const link = card.dataset.link;
        if (!link) return;
        if (tgSafe && typeof tgSafe.openLink === "function") tgSafe.openLink(link);
        else window.open(link, "_blank");
      });
    });

    const hint = $("#newsHint");
    if (hint) hint.textContent = "";
  }

  async function refreshNews({ silent = false } = {}) {
    const hint = $("#newsHint");
    const btn = $("#newsRefreshBtn");
    try {
      if (btn) btn.disabled = true;
      if (hint) hint.textContent = (state.lang === "he") ? "טוען..." : "Загружаю...";

      const all = [];
      for (const f of NEWS_FEEDS) {
        try {
          const part = await fetchFeedItems(f.url);
          part.slice(0, 8).forEach(x => all.push({ ...x, source: f.name }));
        } catch {
          // пропускаем упавший фид
        }
      }

      all.sort((a, b) => (Date.parse(b.pubDate || "") || 0) - (Date.parse(a.pubDate || "") || 0));
      const top = all.slice(0, 18);

      saveNewsCache(top);
      renderNews(top);

      if (!silent) toast((state.lang === "he") ? "עודכן ✅" : "Обновлено ✅");
    } catch {
      const cached = loadNewsCache();
      renderNews(cached.items);
      if (hint) hint.textContent = (state.lang === "he")
        ? "שגיאת טעינה. מוצג מטמון."
        : "Ошибка загрузки. Показан кеш.";
    } finally {
      if (btn) btn.disabled = false;
      if (hint && (!($("#newsRoot")?.children?.length))) hint.textContent = t("newsEmpty");
    }
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
    const greetingEl = $("#greeting");
    if (greetingEl) greetingEl.textContent = nowGreeting();

    // username
    const fromTg = tgSafe ? (tgSafe.initDataUnsafe?.user?.first_name || tgSafe.initDataUnsafe?.user?.username) : null;
    const name = state.profile.name || fromTg || (state.lang === "he" ? "מאסטר" : "мастер");
    if ($("#username")) $("#username").textContent = name;
    if ($("#profileName")) $("#profileName").textContent = name;
    if ($("#profileMeta")) $("#profileMeta").textContent = tgSafe ? `@${tgSafe.initDataUnsafe?.user?.username || "telegram"} • WebApp` : "Browser mode";

    // stats
    const gp = globalProgress();
    const ownedCount = ACADEMY_DATA.courses.filter(c => isOwned(c.id)).length;
    const paidCount = ACADEMY_DATA.courses.filter(c => c.price > 0).length;

    const statsEl = $("#homeStats");
    if (statsEl) {
      statsEl.innerHTML = `
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
    }

    // quick start list
    const quick = [
      state.lang === "he" ? "1) בחר קורס והתחל שיעור" : "1) Выбери курс и начни урок",
      state.lang === "he" ? "2) סיים שיעור וסמן כהושלם" : "2) Закончи урок и отметь как пройденный",
      state.lang === "he" ? "3) עבר מבחן לקבלת 100% בפרק" : "3) Пройди тест, чтобы закрепить знания"
    ];
    const ql = $("#quickList");
    if (ql) ql.innerHTML = quick.map(x => `<div class="list-row">${escapeHtml(x)}</div>`).join("");

    // recommended cards (top 3)
    const rec = ACADEMY_DATA.courses.slice(0, 3);
    const recRoot = $("#homeRecommended");
    if (recRoot) {
      recRoot.innerHTML = rec.map(c => courseCardHTML(c)).join("");
      $$("#homeRecommended .card").forEach(card => {
        card.addEventListener("click", () => openCourse(card.dataset.id));
      });
    }

    // news from cache
    const cached = loadNewsCache();
    renderNews(cached.items);
    const hint = $("#newsHint");
    if (hint && (!cached.items || !cached.items.length)) hint.textContent = t("newsEmpty");
  }

  // ---------------------------
  // Render: Courses
  // ---------------------------
  function courseCardHTML(course) {
    const owned = isOwned(course.id);
    const p = courseProgress(course.id);
    const priceLabel = course.price === 0 ? t("free") : `${course.price} ₪`;
    const lockBadge = owned ? `${t("accessGranted")}` : `${t("locked")}`;
    const payBadge = course.price === 0 ? `${t("free")}` : `${t("paid")}`;

    return `
      <article class="card" data-id="${escapeHtml(course.id)}">
        <div class="card__body">
          <h3 class="card__title">${escapeHtml(course.title[state.lang])}</h3>
          <p class="card__desc">${escapeHtml(course.desc[state.lang])}</p>

          <div class="card__meta">
            <span class="chip">${escapeHtml(priceLabel)}</span>
            <span class="chip">${escapeHtml(payBadge)}</span>
            <span class="chip">${escapeHtml(course.level[state.lang])}</span>
            <span class="chip">${course.lessons.length} ${escapeHtml(t("lessons"))}</span>
            <span class="chip">${escapeHtml(lockBadge)}</span>
          </div>

          <div class="progressline">
            <span>${state.lang === "he" ? "הושלם" : "Пройдено"}: ${p.done}/${p.total}</span>
            <span>${p.pct}%</span>
          </div>
        </div>
      </article>
    `;
  }

  function renderCourses() {
    const root = $("#coursesRoot");
    if (!root) return;

    const q = (($("#coursesSearch")?.value || "").trim().toLowerCase());
    const filter = ($("#coursesFilter")?.value || "all");

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

    if ($("#courseTitle")) $("#courseTitle").textContent = course.title[state.lang];

    const owned = isOwned(courseId);
    const p = courseProgress(courseId);
    const priceLabel = course.price === 0 ? t("free") : `${course.price} ₪`;
    const accessLine = owned ? `${t("accessGranted")}` : `${t("accessMissing")}`;

    const buyBtn = (!owned && course.price > 0)
      ? `<button class="btn btn-primary" id="buyCourseBtn">${escapeHtml(t("buy"))} • ${escapeHtml(priceLabel)}</button>
         <div class="hint">${escapeHtml(t("adminInvoiceHint"))}</div>`
      : "";

    const openBtn = owned
      ? `<button class="btn btn-secondary" id="continueCourseBtn">${escapeHtml(t("continue"))}</button>`
      : "";

    const lockedText = (!owned && course.price > 0)
      ? `<div class="warn">
           <div class="warn__title">${escapeHtml(t("locked"))}</div>
           <div class="warn__text">${escapeHtml(
             state.lang === "he"
               ? "כדי לפתוח — רכוש גישה או בקש ממנהל לתת גישה אחרי תשלום."
               : "Чтобы открыть — купи доступ или попроси администратора выдать доступ после оплаты."
           )}</div>
         </div>`
      : "";

    const courseRoot = $("#courseRoot");
    if (!courseRoot) return;

    courseRoot.innerHTML = `
      <div class="breadcrumbs">${escapeHtml(course.category[state.lang])}</div>
      <h2>${escapeHtml(course.title[state.lang])}</h2>

      <div class="card__meta">
        <span class="chip">${escapeHtml(priceLabel)}</span>
        <span class="chip">${escapeHtml(course.level[state.lang])}</span>
        <span class="chip">${course.lessons.length} ${escapeHtml(t("lessons"))}</span>
        <span class="chip">${escapeHtml(accessLine)}</span>
        <span class="chip">${(state.lang === "he" ? "הושלם" : "Пройдено")}: ${p.done}/${p.total} • ${p.pct}%</span>
      </div>

      <div class="row">${buyBtn} ${openBtn}</div>
      ${lockedText}

      <h3>${escapeHtml(state.lang === "he" ? "שיעורים" : "Уроки")}</h3>
    `;

    // Lessons list
    const listEl = $("#lessonsList");
    if (!listEl) return;

    listEl.innerHTML = course.lessons.map((l, idx) => {
      const done = lessonDone(l.id);
      const test = state.progress[l.id]?.test;
      const testBadge = l.test ? (test?.passed ? `${t("passed")}` : `${t("test")}`) : "";
      const lock = (!owned && course.price > 0);

      return `
        <div class="list-item" data-lesson="${escapeHtml(l.id)}">
          <div class="list-item__title">${idx + 1}. ${escapeHtml(l.title[state.lang])}</div>
          <div class="list-item__meta">
            <span class="chip">${l.durationMin} ${escapeHtml(t("minutes"))}</span>
            <span class="chip">${done ? "✅" : "⬜"} ${done ? escapeHtml(t("done")) : ""}</span>
            ${testBadge ? `<span class="chip">${escapeHtml(testBadge)}</span>` : ""}
            <span class="chip">${escapeHtml(lock ? t("locked") : t("open"))}</span>
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
    if (buyBtnEl) buyBtnEl.addEventListener("click", () => purchaseFlow(course));

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
    if (tgSafe && typeof tgSafe.openInvoice === "function" && course.invoiceUrl) {
      try {
        tgSafe.openInvoice(course.invoiceUrl, (status) => {
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
      const ok = confirm(
        state.lang === "he"
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

    if ($("#lessonTitle")) $("#lessonTitle").textContent = lesson.title[state.lang];

    const done = lessonDone(lessonId);
    const test = state.progress[lessonId]?.test;

    const videoBlock = lesson.videoUrl
      ? `<h3>${escapeHtml(state.lang === "he" ? "וידאו" : "Видео")}</h3>
         <a class="link" href="${escapeHtml(lesson.videoUrl)}" target="_blank" rel="noreferrer">
           ${escapeHtml(state.lang === "he" ? "פתח קישור" : "Открыть ссылку")}
         </a>`
      : "";

    const steps = lesson.steps?.[state.lang] || [];
    const stepsBlock = steps.length
      ? `<h3>${escapeHtml(state.lang === "he" ? "שלבים" : "Шаги")}</h3>
         <ul class="ul">${steps.map(s => `<li>${escapeHtml(s)}</li>`).join("")}</ul>`
      : "";

    const checklist = lesson.checklist?.[state.lang] || [];
    const checklistBlock = checklist.length
      ? `<h3>${escapeHtml(state.lang === "he" ? "צ׳ק-ליסט" : "Чек-лист")}</h3>
         <ul class="ul">${checklist.map(s => `<li>☑ ${escapeHtml(s)}</li>`).join("")}</ul>`
      : "";

    const text = lesson.text?.[state.lang] || "";
    const textBlock = text
      ? `<h3>${escapeHtml(state.lang === "he" ? "תוכן" : "Контент")}</h3>
         <div class="prose">${escapeHtml(text)}</div>`
      : "";

    const testBtn = lesson.test
      ? `<button class="btn btn-secondary" id="openTestBtn">${escapeHtml(test?.passed ? t("retakeTest") : t("startTest"))}</button>`
      : "";

    const markBtn = `<button class="btn btn-primary" id="markDoneBtn">${escapeHtml(t("markDone"))}</button>`;

    const testInfo = lesson.test
      ? `<div class="section">
           <h3>${escapeHtml(t("test"))}</h3>
           <div class="hint">${
             test
               ? `${escapeHtml(t("score"))}: ${test.score}% • ${escapeHtml(test.passed ? t("passed") : t("notPassed"))}`
               : escapeHtml(state.lang === "he" ? "עדיין לא בוצע" : "Ещё не проходили")
           }</div>
         </div>`
      : "";

    const root = $("#lessonRoot");
    if (!root) return;

    root.innerHTML = `
      <div class="breadcrumbs">${escapeHtml(course.title[state.lang])}</div>
      <h2>${escapeHtml(lesson.title[state.lang])}</h2>

      <div class="card__meta">
        <span class="chip">${lesson.durationMin} ${escapeHtml(t("minutes"))}</span>
        <span class="chip">${done ? "✅" : "⬜"} ${escapeHtml(done ? t("done") : (state.lang === "he" ? "לא הושלם" : "Не пройден"))}</span>
      </div>

      <div class="row">${testBtn} ${markBtn}</div>

      ${testInfo}
      ${videoBlock}
      ${stepsBlock}
      ${checklistBlock}
      ${textBlock}
    `;

    const mark = $("#markDoneBtn");
    if (mark) {
      mark.addEventListener("click", () => {
        setLessonDone(lessonId, true);
        toast(t("toastSaved"));
        renderLesson(courseId, lessonId);
        renderAll(); // update progress
      });
    }

    const openTest = $("#openTestBtn");
    if (openTest) openTest.addEventListener("click", () => openTestScreen(courseId, lessonId));
  }

  // ---------------------------
  // Render: Test
  // ---------------------------
  function renderTest(courseId, lessonId) {
    const lesson = getLesson(courseId, lessonId);
    if (!lesson?.test) return;

    if ($("#testTitle")) $("#testTitle").textContent = `${t("test")} • ${lesson.title[state.lang]}`;

    const test = lesson.test;
    const prev = state.progress[lessonId]?.test;

    const root = $("#testRoot");
    if (!root) return;

    root.innerHTML = `
      <div class="hint">${escapeHtml(state.lang === "he" ? "בחר תשובות" : "Выберите ответы")}</div>
      <div class="hint">${escapeHtml(state.lang === "he" ? "אחרי סיום — תקבל תוצאה ופתרונות." : "После завершения — получите результат и разбор.")}</div>

      <div class="row">
        <button class="btn btn-primary" id="submitTest">${escapeHtml(state.lang === "he" ? "בדוק" : "Проверить")}</button>
        <button class="btn btn-ghost" id="clearTest">${escapeHtml(state.lang === "he" ? "נקה" : "Очистить")}</button>
      </div>

      ${prev ? `<div class="hint">${escapeHtml(state.lang === "he" ? "תוצאה קודמת" : "Предыдущий результат")}: ${prev.score}%</div>` : ""}

      <form id="testForm" class="form"></form>
      <div id="testResult" class="prose"></div>
    `;

    const form = $("#testForm");
    if (!form) return;

    form.innerHTML = test.questions.map((q, qi) => {
      const qId = `q_${qi}`;
      const opts = q.options[state.lang];
      return `
        <div class="q">
          <div class="q__title">${qi + 1}. ${escapeHtml(q.text[state.lang])}</div>
          <div class="q__opts">
            ${opts.map((opt, oi) => `
              <label class="radio">
                <input type="radio" name="${escapeHtml(qId)}" value="${oi}">
                <span>${escapeHtml(opt)}</span>
              </label>
            `).join("")}
          </div>
        </div>
      `;
    }).join("");

    const submit = $("#submitTest");
    if (submit) {
      submit.addEventListener("click", () => {
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

        const result = $("#testResult");
        if (result) {
          result.innerHTML = `
            <h3>${passed ? "✅ " + escapeHtml(t("passed")) : "❌ " + escapeHtml(t("notPassed"))}</h3>
            <div>${escapeHtml(t("score"))}: ${score}% • ${escapeHtml(state.lang === "he" ? "נכון" : "Верно")}: ${correct}/${total}</div>

            <h3>${escapeHtml(state.lang === "he" ? "פתרונות" : "Разбор")}</h3>
            ${breakdown.map((b, i) => {
              const opts = b.q.options[state.lang];
              const your = (b.picked == null)
                ? (state.lang === "he" ? "לא נבחר" : "не выбрано")
                : opts[b.picked];
              const right = opts[b.correct];
              return `
                <div class="break">
                  <div>${b.ok ? "✅" : "❌"} ${i + 1}. ${escapeHtml(b.q.text[state.lang])}</div>
                  <div class="hint">${escapeHtml(state.lang === "he" ? "שלך" : "Твой")}: ${escapeHtml(String(your))} • ${escapeHtml(state.lang === "he" ? "נכון" : "Правильно")}: ${escapeHtml(String(right))}</div>
                </div>
              `;
            }).join("")}
          `;
        }

        renderAll();
      });
    }

    const clear = $("#clearTest");
    if (clear) {
      clear.addEventListener("click", () => {
        $$("input[type=radio]", form).forEach(x => x.checked = false);
        const r = $("#testResult");
        if (r) r.innerHTML = "";
      });
    }
  }

  // ---------------------------
  // Render: Progress
  // ---------------------------
  function renderProgress() {
    const root = $("#progressRoot");
    if (!root) return;

    const gp = globalProgress();
    const perCourse = ACADEMY_DATA.courses.map(c => {
      const p = courseProgress(c.id);
      return { c, p, owned: isOwned(c.id) };
    });

    root.innerHTML = `
      <div class="card">
        <div class="card__body">
          <h3>${escapeHtml(state.lang === "he" ? "סיכום" : "Сводка")}</h3>
          <div class="progressline"><span>${gp.pct}%</span><span>${escapeHtml(state.lang === "he" ? "שיעורים הושלמו" : "Уроков пройдено")}: ${gp.done}/${gp.total}</span></div>
        </div>
      </div>

      ${perCourse.map(({ c, p, owned }) => `
        <article class="card" data-id="${escapeHtml(c.id)}">
          <div class="card__body">
            <h3 class="card__title">${escapeHtml(c.title[state.lang])}</h3>
            <div class="card__meta">
              <span class="chip">${escapeHtml(c.category[state.lang])}</span>
              <span class="chip">${escapeHtml(c.level[state.lang])}</span>
              <span class="chip">${p.pct}%</span>
              <span class="chip">${p.done}/${p.total}</span>
              <span class="chip">${escapeHtml(owned ? t("accessGranted") : t("locked"))}</span>
            </div>
          </div>
        </article>
      `).join("")}
    `;

    $$("#progressRoot .card[data-id]").forEach(card => {
      card.addEventListener("click", () => openCourse(card.dataset.id));
    });
  }

  // ---------------------------
  // Render: Wiki
  // ---------------------------
  function buildWikiCategories() {
    const select = $("#wikiCategory");
    if (!select) return;

    const unique = new Map();
    ACADEMY_DATA.wiki.forEach(w => unique.set(w.categoryKey, w.category));

    select.innerHTML =
      `<option value="all">${escapeHtml(t("wikiAllCats"))}</option>` +
      Array.from(unique.entries()).map(([key, name]) =>
        `<option value="${escapeHtml(key)}">${escapeHtml(name[state.lang])}</option>`
      ).join("");
  }

  function renderWiki() {
    const root = $("#wikiRoot");
    if (!root) return;

    const q = (($("#wikiSearch")?.value || "").trim().toLowerCase());
    const cat = ($("#wikiCategory")?.value || "all");

    const items = ACADEMY_DATA.wiki.filter(w => {
      const matchCat = (cat === "all") || (w.categoryKey === cat);
      if (!matchCat) return false;

      const title = w.title[state.lang].toLowerCase();
      const body = w.body[state.lang].toLowerCase();
      return !q || title.includes(q) || body.includes(q);
    });

    root.innerHTML = items.map(w => `
      <article class="card" data-id="${escapeHtml(w.id)}">
        <div class="card__body">
          <h3 class="card__title">${escapeHtml(w.title[state.lang])}</h3>
          <p class="card__desc">${escapeHtml(w.preview[state.lang])}</p>
          <div class="card__meta">
            <span class="chip">${escapeHtml(w.category[state.lang])}</span>
            ${w.tags[state.lang].slice(0, 4).map(tag => `<span class="chip">${escapeHtml(tag)}</span>`).join("")}
          </div>
        </div>
      </article>
    `).join("");

    $$("#wikiRoot .card").forEach(card => {
      card.addEventListener("click", () => openWikiItem(card.dataset.id));
    });
  }

  function openWikiItem(id) {
    const w = ACADEMY_DATA.wiki.find(x => x.id === id);
    if (!w) return;

    if ($("#courseTitle")) $("#courseTitle").textContent = w.title[state.lang];
    const courseRoot = $("#courseRoot");
    if (courseRoot) {
      courseRoot.innerHTML = `
        <div class="breadcrumbs">
          ${escapeHtml(w.category[state.lang])}
          ${w.tags[state.lang].slice(0, 6).map(tag => `<span class="chip">${escapeHtml(tag)}</span>`).join("")}
        </div>
        <div class="prose">${escapeHtml(w.body[state.lang])}</div>
      `;
    }

    showScreen("course");
    current.courseId = null;
    current.lessonId = null;
  }

  // ---------------------------
  // Render: Profile & Owned
  // ---------------------------
  function renderProfile() {
    const ownedRoot = $("#ownedRoot");
    if (!ownedRoot) return;

    const owned = ACADEMY_DATA.courses.filter(c => isOwned(c.id));

    ownedRoot.innerHTML = owned.length
      ? owned.map(c => `
          <div class="list-item" data-id="${escapeHtml(c.id)}">
            <div class="list-item__title">${escapeHtml(c.title[state.lang])}</div>
            <div class="list-item__meta">
              <span class="chip">${escapeHtml(c.price === 0 ? t("free") : `${c.price} ₪`)}</span>
              <span class="chip">${escapeHtml(c.category[state.lang])}</span>
              <span class="chip">${escapeHtml(t("open"))}</span>
            </div>
          </div>
        `).join("")
      : `<div class="hint">${escapeHtml(state.lang === "he" ? "עדיין אין גישות." : "Пока нет доступов.")}</div>`;

    $$("#ownedRoot .list-item").forEach(item => {
      item.addEventListener("click", () => openCourse(item.dataset.id));
    });

    if ($("#profileAvatar")) $("#profileAvatar").textContent = "MR";
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
    if (!root) return;

    const isLogged = state.admin.unlocked;

    if (!isLogged) {
      root.innerHTML = `
        <h2>${escapeHtml(t("adminEnterPin"))}</h2>
        <div class="row">
          <input class="input" id="adminPin" placeholder="${escapeHtml(t("adminPinPlaceholder"))}">
          <button class="btn btn-primary" id="adminLoginBtn">${escapeHtml(t("adminLogin"))}</button>
        </div>
        <div class="hint">${escapeHtml(t("adminSetPinInfo"))}</div>
      `;

      const loginBtn = $("#adminLoginBtn");
      if (loginBtn) {
        loginBtn.addEventListener("click", () => {
          const v = ($("#adminPin")?.value || "").trim();
          if (v === ADMIN_PIN) {
            state.admin.unlocked = true;
            saveState();
            toast(t("toastUnlocked"));
            renderAdmin();
          } else {
            toast(t("adminWrongPin"));
          }
        });
      }
      return;
    }

    root.innerHTML = `
      <h2>${escapeHtml(t("adminPanel"))}</h2>
      <div class="hint">${escapeHtml(t("adminInvoiceHint"))}</div>

      <h3>${escapeHtml(t("adminUnlockByCourse"))}</h3>
      <div class="row">
        <select class="select" id="adminCourseSelect">
          ${ACADEMY_DATA.courses.filter(c => c.price > 0).map(c =>
            `<option value="${escapeHtml(c.id)}">${escapeHtml(c.title[state.lang])} (${c.price}₪)</option>`
          ).join("")}
        </select>
        <button class="btn btn-primary" id="adminGrantBtn">${escapeHtml(state.lang === "he" ? "תן גישה" : "Выдать доступ")}</button>
      </div>

      <div class="row">
        <button class="btn btn-secondary" id="adminUnlockAll">${escapeHtml(t("adminUnlockAll"))}</button>
        <button class="btn btn-ghost" id="adminLockAll">${escapeHtml(t("adminLockAll"))}</button>
      </div>

      <h3>${escapeHtml(state.lang === "he" ? "סטטוס רכישות (מקומי)" : "Статус покупок (локально)")}</h3>
      <pre class="dump" id="adminDump"></pre>
      <div class="row">
        <button class="btn btn-ghost" id="copyDump">${escapeHtml(state.lang === "he" ? "העתק" : "Копировать")}</button>
        <button class="btn btn-ghost" id="logoutAdmin">${escapeHtml(state.lang === "he" ? "התנתק" : "Выйти")}</button>
      </div>
    `;

    const dump = $("#adminDump");
    if (dump) dump.textContent = JSON.stringify({ purchased: state.purchased }, null, 2);

    const grantBtn = $("#adminGrantBtn");
    if (grantBtn) {
      grantBtn.addEventListener("click", () => {
        const courseId = $("#adminCourseSelect")?.value;
        if (!courseId) return;
        grantAccess(courseId, "manual", null);
        renderAdmin();
      });
    }

    const unlockAll = $("#adminUnlockAll");
    if (unlockAll) {
      unlockAll.addEventListener("click", () => {
        ACADEMY_DATA.courses.filter(c => c.price > 0).forEach(c => grantAccess(c.id, "manual"));
        renderAdmin();
      });
    }

    const lockAll = $("#adminLockAll");
    if (lockAll) {
      lockAll.addEventListener("click", () => {
        revokeAllAccess();
        toast(state.lang === "he" ? "ננעל" : "Закрыто");
        renderAdmin();
      });
    }

    const copy = $("#copyDump");
    if (copy) {
      copy.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText($("#adminDump")?.textContent || "");
          toast(t("toastCopied"));
        } catch {
          toast(state.lang === "he" ? "לא ניתן להעתיק" : "Не удалось скопировать");
        }
      });
    }

    const logout = $("#logoutAdmin");
    if (logout) {
      logout.addEventListener("click", () => {
        state.admin.unlocked = false;
        saveState();
        renderAdmin();
      });
    }
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
    if ($("#brandSubtitle")) $("#brandSubtitle").textContent = t("brandSubtitle");
    if ($("#homeLead")) $("#homeLead").textContent = t("homeLead");
    if ($("#openCourses")) $("#openCourses").textContent = t("openCourses");
    if ($("#openWiki")) $("#openWiki").textContent = t("openWiki");
    if ($("#quickTitle")) $("#quickTitle").textContent = t("quickTitle");
    if ($("#quickHint")) $("#quickHint").textContent = t("quickHint");
    if ($("#openWash")) $("#openWash").textContent = t("openAfterWash");
    if ($("#homeSectionTitle")) $("#homeSectionTitle").textContent = t("homeSectionTitle");
    if ($("#coursesTitle")) $("#coursesTitle").textContent = t("coursesTitle");
    if ($("#coursesSearch")) $("#coursesSearch").setAttribute("placeholder", t("coursesSearch"));
    if ($("#progressTitle")) $("#progressTitle").textContent = t("progressTitle");
    if ($("#wikiTitle")) $("#wikiTitle").textContent = t("wikiTitle");
    if ($("#wikiSearch")) $("#wikiSearch").setAttribute("placeholder", t("wikiSearch"));
    if ($("#profileTitle")) $("#profileTitle").textContent = t("profileTitle");
    if ($("#resetProgress")) $("#resetProgress").textContent = t("resetProgress");
    if ($("#exportData")) $("#exportData").textContent = t("exportData");
    if ($("#profileHint")) $("#profileHint").textContent = t("profileHint");
    if ($("#ownedTitle")) $("#ownedTitle").textContent = t("ownedTitle");
    if ($("#navHome")) $("#navHome").textContent = t("nav.home");
    if ($("#navCourses")) $("#navCourses").textContent = t("nav.courses");
    if ($("#navProgress")) $("#navProgress").textContent = t("nav.progress");
    if ($("#navWiki")) $("#navWiki").textContent = t("nav.wiki");
    if ($("#navProfile")) $("#navProfile").textContent = t("nav.profile");
    if ($("#adminTitle")) $("#adminTitle").textContent = t("adminTitle");

    // NEWS i18n
    if ($("#newsTitle")) $("#newsTitle").textContent = t("newsTitle");
    if ($("#newsRefreshBtn")) $("#newsRefreshBtn").textContent = t("newsRefresh");
    if ($("#newsHint") && !$("#newsRoot")?.children?.length) $("#newsHint").textContent = t("newsEmpty");

    // filters labels
    const f = $("#coursesFilter");
    if (f && f.options && f.options.length >= 4) {
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
    const closeBtn = $("#closeBtn");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        if (tgSafe) safe(() => tgSafe.close());
        else toast(state.lang === "he" ? "אין Telegram" : "Нет Telegram WebApp");
      });
    }

    // lang toggle
    const lt = $("#langToggle");
    if (lt) {
      lt.addEventListener("click", () => {
        const next = state.lang === "ru" ? "he" : "ru";
        setLang(next);
        lt.textContent = next.toUpperCase();
      });
      lt.textContent = state.lang.toUpperCase();
    }

    // home quick buttons
    const oc = $("#openCourses");
    if (oc) oc.addEventListener("click", () => { showScreen("courses"); renderAll(); });

    const ow = $("#openWiki");
    if (ow) ow.addEventListener("click", () => { showScreen("wiki"); renderAll(); });

    // manual unlock button (after wash)
    const washBtn = $("#openWash");
    if (washBtn) {
      washBtn.addEventListener("click", () => {
        // Fast: unlock course with unlockOnWash=true, else first paid
        const defaultCourse = ACADEMY_DATA.courses.find(c => c.unlockOnWash === true);
        if (defaultCourse) {
          grantAccess(defaultCourse.id, "manual");
        } else {
          const firstPaid = ACADEMY_DATA.courses.find(c => c.price > 0);
          if (firstPaid) grantAccess(firstPaid.id, "manual");
        }
      });
    }

    // NEWS refresh
    const newsBtn = $("#newsRefreshBtn");
    if (newsBtn) {
      newsBtn.addEventListener("click", () => refreshNews({ silent: false }));
    }

    // search/filter courses
    const cs = $("#coursesSearch");
    if (cs) cs.addEventListener("input", renderCourses);

    const cf = $("#coursesFilter");
    if (cf) cf.addEventListener("change", renderCourses);

    // wiki search
    const ws = $("#wikiSearch");
    if (ws) ws.addEventListener("input", renderWiki);

    const wc = $("#wikiCategory");
    if (wc) wc.addEventListener("change", renderWiki);

    // back buttons
    const b1 = $("#backToCourses");
    if (b1) b1.addEventListener("click", () => { showScreen("courses"); renderAll(); });

    const b2 = $("#backToCourse");
    if (b2) b2.addEventListener("click", () => {
      showScreen("course");
      if (current.courseId) renderCourse(current.courseId);
    });

    const b3 = $("#backToLesson");
    if (b3) b3.addEventListener("click", () => {
      showScreen("lesson");
      if (current.courseId && current.lessonId) renderLesson(current.courseId, current.lessonId);
    });

    const b4 = $("#backFromAdmin");
    if (b4) b4.addEventListener("click", () => { showScreen("profile"); renderAll(); });

    // profile actions
    const rp = $("#resetProgress");
    if (rp) {
      rp.addEventListener("click", () => {
        const ok = confirm(state.lang === "he" ? "לאפס את ההתקדמות?" : "Сбросить прогресс?");
        if (!ok) return;
        state.progress = {};
        saveState();
        toast(t("toastReset"));
        renderAll();
      });
    }

    const ex = $("#exportData");
    if (ex) {
      ex.addEventListener("click", async () => {
        const payload = JSON.stringify({ state, exportedAt: new Date().toISOString() }, null, 2);
        try {
          await navigator.clipboard.writeText(payload);
          toast(t("toastCopied"));
        } catch {
          alert(payload);
        }
      });
    }

    // admin easter: 7 taps on logo
    const brand = $("#brandTap");
    if (brand) {
      brand.addEventListener("click", () => {
        brandTapCount += 1;
        clearTimeout(brandTapTimer);
        brandTapTimer = setTimeout(() => { brandTapCount = 0; }, 1200);
        if (brandTapCount >= 7) {
          brandTapCount = 0;
          openAdmin();
        }
      });
    }
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
      .replaceAll("'", "&#39;");
  }

  // ---------------------------
  // Boot
  // ---------------------------
  function boot() {
    if (!["ru", "he"].includes(state.lang)) state.lang = "ru";

    applyLangDir();

    const lt = $("#langToggle");
    if (lt) lt.textContent = state.lang.toUpperCase();

    applyI18n();

    showScreen("home");
    buildWikiCategories();
    bindEvents();
    renderAll();

    // optional: авто-подгрузка новостей один раз (тихо) если кеш пустой
    const cached = loadNewsCache();
    if ((!cached.items || !cached.items.length) && $("#newsRoot")) {
      refreshNews({ silent: true });
    }
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
              ru: "Самое дорогое — не химия, а ошибки.\nОшибка мойки = паутинка на лаке.",
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
          ru: "Полный цикл подготовки кузова: что, чем и в каком порядке.\nОшибки, риски, нормы расхода.",
          he: "מחזור מלא להכנת צבע: מה, עם מה ובאיזה סדר.\nטעויות, סיכונים ונורמות שימוש."
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
                  options: { ru: ["Глина", "Айрон/битум (химия)", "Полировка"], he: ["קליי", "איירון/זפת (כימיה)", "פוליש"] },
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
        preview: { ru: "Что защищает, как клеится, уход, ошибки и срок службы.", he: "מה זה מגן, איך מדביקים, תחזוקה, טעויות ואורך חיים." },
        tags: { ru: ["PPF", "плёнка", "защита", "камни"], he: ["PPF", "סרט", "הגנה", "אבנים"] },
        body: {
          ru:
            "PPF (Paint Protection Film) — прозрачная полиуретановая плёнка для защиты ЛКП.\n\n" +
            "Главные плюсы:\n• защита от сколов/пескоструя\n• само-восстановление мелких царапин (на части плёнок)\n• легче поддерживать чистоту\n\n" +
            "Минусы:\n• цена и трудоемкость\n• важна подготовка поверхности\n\n" +
            "Уход:\n• мягкая химия\n• избегать агрессивных растворителей\n• регулярная мойка и сушка",
          he:
            "PPF הוא סרט פוליאוריטן שקוף להגנת הצבע.\n\n" +
            "יתרונות:\n• הגנה מפגיעות/אבנים\n• התאוששות שריטות קלות בחלק מהסרטים\n• תחזוקה קלה יותר\n\n" +
            "חסרונות:\n• מחיר ועבודה מורכבת\n• הכנה נכונה קריטית\n\n" +
            "תחזוקה:\n• כימיה עדינה\n• להימנע מממסים חזקים\n• שטיפה וייבוש קבועים"
        }
      },

      {
        id: "w_iron",
        categoryKey: "chemistry",
        category: { ru: "Химия", he: "כימיה" },
        title: { ru: "Айрон-ремувер: как работает", he: "איירון רימובר: איך זה עובד" },
        preview: { ru: "Что такое 'кровоточащая' реакция, где применять и что нельзя делать.", he: "מה זו תגובת 'דימום', איפה להשתמש וממה להיזהר." },
        tags: { ru: ["айрон", "диски", "металлические вкрапления"], he: ["איירון", "חישוקים", "חלקיקי מתכת"] },
        body: {
          ru:
            "Айрон-ремувер растворяет металлические вкрапления.\n" +
            "Реакция фиолетового цвета — нормальная.\n\n" +
            "Правила:\n• не на горячей поверхности\n• не давать высохнуть\n• тщательно смывать\n\n" +
            "Часто используют по дискам и по кузову перед глиной.",
          he:
            "איירון רימובר ממיס חלקיקי מתכת.\n" +
            "התגובה הסגולה היא תקינה.\n\n" +
            "כללים:\n• לא על משטח חם\n• לא לתת להתייבש\n• לשטוף היטב\n\n" +
            "משתמשים הרבה על חישוקים ועל הצבע לפני קליי."
        }
      }
    ]
  };
})();
