/* MR Detailing Academy — Telegram WebApp SPA
   RU/HE + RTL, Courses (paid), Lessons, Tests, Progress, Wiki, Profile, Admin, News (RSS)
*/
(() => {
  "use strict";

  // ---------------------------
  // Telegram safe init
  // ---------------------------
  const tg = window.Telegram?.WebApp || null;
  const safe = (fn) => { try { return fn(); } catch { return null; } };

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
  const uid = (p = "id") => `${p}_${Math.random().toString(16).slice(2)}_${Date.now()}`;

  function escapeHtml(str) {
    return String(str ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  // ---------------------------
  // Storage
  // ---------------------------
  const LS_KEY = "mr_academy_state_v3";
  const NEWS_LS_KEY = "mr_academy_news_cache_v2";

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
      purchased: {}, // courseId -> {at, method}
      progress: {},  // lessonId -> {done, test:{passed,score,at}}
      profile: { name: null },
      admin: { unlocked: false }
    };
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return base;
      return deepMerge(base, JSON.parse(raw));
    } catch {
      return base;
    }
  }

  function saveState() {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  }

  // ---------------------------
  // I18N
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

      navHome: "Главная",
      navNews: "Новости",
      navCourses: "Курсы",
      navProgress: "Прогресс",
      navWiki: "Вики",
      navProfile: "Профиль",

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

      adminTitle: "Админ",
      back: "← Назад",

      locked: "Закрыто",
      free: "Бесплатно",
      paid: "Платный",
      buy: "Купить доступ",
      open: "Открыть",
      continue: "Продолжить",
      lessons: "уроков",
      minutes: "мин",
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
      adminUnlockByCourse: "Выдать доступ к курсу (локально)",
      adminUnlockAll: "Открыть все курсы (локально)",
      adminLockAll: "Закрыть все курсы (локально)",
      adminSetPinInfo: "PIN задаётся в app.js: ADMIN_PIN",
      adminInvoiceHint: "Авто-оплата через Telegram invoice требует бэкенд (позже подключим).",

      toastUnlocked: "Доступ открыт ✅",
      toastSaved: "Сохранено ✅",
      toastReset: "Прогресс сброшен ✅",
      toastCopied: "Скопировано ✅",

      newsTitle: "Новости",
      newsRefresh: "Обновить",
      newsClear: "Сбросить кэш",
      newsSearch: "Поиск",
      newsSources: "Источники",
      newsEmpty: "Пока нет новостей — нажми «Обновить».",
      newsLoading: "Загружаю…",
      newsCacheShown: "Показан кеш.",
      invoiceNotReady: "Сейчас нет invoice link.\nВыдай доступ вручную или подключи бэкенд."
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

      navHome: "בית",
      navNews: "חדשות",
      navCourses: "קורסים",
      navProgress: "התקדמות",
      navWiki: "ויקי",
      navProfile: "פרופיל",

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

      adminTitle: "אדמין",
      back: "← חזרה",

      locked: "נעול",
      free: "חינמי",
      paid: "בתשלום",
      buy: "קנה גישה",
      open: "פתח",
      continue: "המשך",
      lessons: "שיעורים",
      minutes: "דק׳",
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
      adminInvoiceHint: "תשלום אוטומטי דרך Invoice דורש שרת (נחבר בהמשך).",

      toastUnlocked: "גישה נפתחה ✅",
      toastSaved: "נשמר ✅",
      toastReset: "התקדמות אופסה ✅",
      toastCopied: "הועתק ✅",

      newsTitle: "חדשות",
      newsRefresh: "רענן",
      newsClear: "נקה מטמון",
      newsSearch: "חיפוש",
      newsSources: "מקורות",
      newsEmpty: "אין חדשות עדיין — לחץ על “רענן”.",
      newsLoading: "טוען…",
      newsCacheShown: "מוצג מטמון.",
      invoiceNotReady: "אין invoice link כרגע.\nתן גישה ידנית או חבר שרת."
    }
  };

  function t(key) {
    const lang = (state.lang === "he") ? "he" : "ru";
    return I18N[lang]?.[key] ?? key;
  }

  // ---------------------------
  // RTL apply (IMPORTANT: also toggle html.lang-he for your CSS)
  // ---------------------------
  function applyLangDir() {
    const lang = (state.lang === "he") ? "he" : "ru";
    document.documentElement.lang = lang;
    document.documentElement.dir = (lang === "he") ? "rtl" : "ltr";
    document.documentElement.classList.toggle("lang-he", lang === "he");
  }

  function setLang(newLang) {
    state.lang = (newLang === "he") ? "he" : "ru";
    saveState();
    applyLangDir();
    applyI18n();
    renderAll();
  }

  // ---------------------------
  // Routing / Screens
  // ---------------------------
  const screens = ["home","news","courses","course","lesson","test","progress","wiki","profile","admin"];
  const screenEls = new Map(screens.map(s => [s, $(`#screen-${s}`)]));
  const navItems = $$(".nav__item");

  const current = { tab: "home", courseId: null, lessonId: null };

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
      el.style.fontWeight = "900";
      el.style.boxShadow = "0 12px 30px rgba(0,0,0,.45)";
      el.style.zIndex = "999";
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.style.opacity = "1";
    toastTimer = setTimeout(() => { el.style.opacity = "0"; }, 2200);
  }

  // ---------------------------
  // DATA (контент можно расширять здесь)
  // ---------------------------
  const DATA = {
    settings: {
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
          he: "מושגים, שטיפה בטוחה ופילוסופיית איכות."
        },
        invoiceUrl: null,
        lessons: [
          {
            id: "l_intro_1",
            durationMin: 8,
            title: { ru: "Что такое детейлинг и зачем он нужен", he: "מה זה דיטלינג ולמה זה חשוב" },
            text: {
              ru: "Детейлинг — это набор процедур по восстановлению и защите авто.\nКлюч: минимальный риск, повторяемый результат, правильная химия и инструменты.",
              he: "דיטלינג הוא סט פעולות לשיקום והגנה על הרכב.\nהמפתח: מינימום סיכון, תוצאה עקבית וכימיה/כלים נכונים."
            },
            steps: {
              ru: ["Детейлинг ≠ мойка", "Цель — сохранить ЛКП/салон", "Системность и контроль риска"],
              he: ["דיטלינג ≠ שטיפה", "מטרה — לשמור על צבע/פנים", "שיטתיות וניהול סיכונים"]
            },
            checklist: {
              ru: ["Оценка состояния", "Фото/видео дефектов", "План работ"],
              he: ["הערכת מצב", "תיעוד פגמים", "תכנית עבודה"]
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
            text: {
              ru: "Самое дорогое — не химия, а ошибки. Ошибка мойки = паутинка на лаке.",
              he: "הכי יקר זה לא הכימיה — זה טעויות. טעות שטיפה = סווירלים בצבע."
            },
            steps: {
              ru: ["Предпена", "Два ведра / минимум контакта", "Сушка без царапин"],
              he: ["קצף מקדים", "שתי דליים / מינימום מגע", "ייבוש ללא שריטות"]
            },
            checklist: {
              ru: ["Чистая рукавица", "Grit guard", "Чистые полотенца"],
              he: ["כפפה נקייה", "Grit Guard", "מגבות נקיות"]
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
          he: "מחזור מלא להכנת צבע: מה, עם מה ובאיזה סדר. טעויות וסיכונים."
        },
        invoiceUrl: null, // позже поставим invoice link
        lessons: [
          {
            id: "l_found_1",
            durationMin: 14,
            title: { ru: "Деконтаминация: айрон, битум, глина", he: "דה-קונטמינציה: איירון, זפת, קליי" },
            text: {
              ru: "Порядок важен: сначала химическая деконтаминация, потом механика (глина).",
              he: "הסדר חשוב: קודם דה-קונטמינציה כימית, אחר כך מכנית (קליי)."
            },
            steps: {
              ru: ["Айрон по дискам/кузову", "Битум точечно", "Глина с лубрикантом"],
              he: ["איירון לחישוקים/צבע", "זפת נקודתית", "קליי עם לובריקנט"]
            },
            checklist: {
              ru: ["Не на горячей панели", "Не давать высохнуть", "Смывать вовремя"],
              he: ["לא על משטח חם", "לא לתת להתייבש", "לשטוף בזמן"]
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
            title: { ru: "Защиты: воск, силанты, керамика", he: "הגנות: וקס, סילנט, קרמי" },
            text: {
              ru: "Воск — быстро и красиво, но недолго. Силант — дольше. Керамика — максимум стойкости при правильной подготовке.",
              he: "וקס — מהיר ויפה אבל פחות עמיד. סילנט — עמיד יותר. קרמי — עמידות מקסימלית עם הכנה נכונה."
            },
            steps: {
              ru: ["Подготовка поверхности", "Нанесение по инструкции", "Уход после нанесения"],
              he: ["הכנת פני שטח", "יישום לפי הוראות", "תחזוקה לאחר יישום"]
            },
            checklist: {
              ru: ["Чистые аппликаторы", "Выдержка", "Первые мойки аккуратно"],
              he: ["אפליקטורים נקיים", "זמן התקשות", "שטיפות ראשונות בזהירות"]
            },
            test: null
          }
        ]
      }
    ],
    wiki: [
      {
        id: "w_ppf",
        categoryKey: "protection",
        category: { ru: "Защита", he: "הגנה" },
        title: { ru: "PPF: полиуретановая плёнка", he: "PPF: סרט פוליאוריטן" },
        preview: { ru: "Что защищает, как клеится, уход и ошибки.", he: "מה זה מגן, איך מדביקים ותחזוקה." },
        tags: { ru: ["PPF", "плёнка", "защита"], he: ["PPF", "סרט", "הגנה"] },
        body: {
          ru: "PPF — прозрачная плёнка для защиты ЛКП от сколов и пескоструя.\n\nУход: мягкая химия, без агрессивных растворителей.",
          he: "PPF הוא סרט שקוף להגנת הצבע מפגיעות.\n\nתחזוקה: כימיה עדינה, בלי ממסים חזקים."
        }
      },
      {
        id: "w_iron",
        categoryKey: "chemistry",
        category: { ru: "Химия", he: "כימיה" },
        title: { ru: "Айрон-ремувер: как работает", he: "איירון רימובר: איך זה עובד" },
        preview: { ru: "Реакция 'кровоточит', где применять и что нельзя делать.", he: "תגובה סגולה, איפה להשתמש וממה להיזהר." },
        tags: { ru: ["айрон", "диски"], he: ["איירון", "חישוקים"] },
        body: {
          ru: "Айрон растворяет металлические вкрапления.\nПравила: не на горячей поверхности, не давать высохнуть, тщательно смывать.",
          he: "איירון ממיס חלקיקי מתכת.\nכללים: לא על משטח חם, לא לתת להתייבש, לשטוף היטב."
        }
      }
    ]
  };

  // ---------------------------
  // Access / Progress helpers
  // ---------------------------
  const getCourse = (id) => DATA.courses.find(c => c.id === id) || null;
  const getLesson = (courseId, lessonId) => getCourse(courseId)?.lessons.find(l => l.id === lessonId) || null;

  function isOwned(courseId) {
    const c = getCourse(courseId);
    if (!c) return false;
    if (c.price === 0) return true;
    return Boolean(state.purchased[courseId]);
  }

  function grantAccess(courseId, method = "manual") {
    state.purchased[courseId] = { at: new Date().toISOString(), method };
    saveState();
    toast(t("toastUnlocked"));
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
    const c = getCourse(courseId);
    if (!c) return { done: 0, total: 0, pct: 0 };
    const total = c.lessons.length;
    const done = c.lessons.filter(l => lessonDone(l.id)).length;
    const pct = total ? Math.round((done / total) * 100) : 0;
    return { done, total, pct };
  }

  function globalProgress() {
    const all = DATA.courses.flatMap(c => c.lessons);
    const total = all.length;
    const done = all.filter(l => lessonDone(l.id)).length;
    const pct = total ? Math.round((done / total) * 100) : 0;
    return { done, total, pct };
  }

  // ---------------------------
  // NEWS (RSS)
  // ---------------------------
  const FEEDS = [
    { id: "slimsdetailing", name: "SlimsDetailing", url: "https://www.slimsdetailing.co.uk/blogs/news" },
    { id: "detailedimage", name: "Detailed Image", url: "https://www.detailedimage.com/Ask-a-Pro/feed/" }
  ];

  function loadNewsCache() {
    try {
      const raw = localStorage.getItem(NEWS_LS_KEY);
      if (!raw) return { at: 0, items: [] };
      const parsed = JSON.parse(raw);
      return {
        at: parsed.at || 0,
        items: Array.isArray(parsed.items) ? parsed.items : []
      };
    } catch {
      return { at: 0, items: [] };
    }
  }

  function saveNewsCache(items) {
    localStorage.setItem(NEWS_LS_KEY, JSON.stringify({ at: Date.now(), items }));
  }

  async function fetchFeedItems(feed) {
    // RSS often blocked by CORS => use rss2json proxy
    const api = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}`;
    const res = await fetch(api, { cache: "no-store" });
    if (!res.ok) throw new Error("rss failed");
    const data = await res.json();
    const items = Array.isArray(data.items) ? data.items : [];
    return items.map(it => ({
      id: it.guid || it.link || uid("news"),
      feedId: feed.id,
      feedName: feed.name,
      title: it.title || "",
      link: it.link || "",
      pubDate: it.pubDate || "",
      desc: (it.description || "").replace(/<[^>]*>/g, "").trim().slice(0, 240)
    }));
  }

  function renderNewsCards(items) {
    const root = $("#newsRoot");
    if (!root) return;

    if (!items?.length) {
      root.innerHTML = "";
      const hint = $("#newsHint");
      if (hint) hint.textContent = t("newsEmpty");
      return;
    }

    root.innerHTML = items.map(n => `
      <article class="card" data-link="${escapeHtml(n.link)}">
        <div class="card__title">${escapeHtml(n.title)}</div>
        <p class="card__desc">${escapeHtml(n.desc || "")}</p>
        <div class="badges">
          <span class="badge">${escapeHtml(n.feedName)}</span>
          <span class="badge">${escapeHtml((n.pubDate || "").slice(0, 16).replace("T"," "))}</span>
        </div>
      </article>
    `).join("");

    $$("#newsRoot .card").forEach(card => {
      card.addEventListener("click", () => {
        const link = card.dataset.link;
        if (!link) return;
        if (tg && typeof tg.openLink === "function") tg.openLink(link);
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
      if (hint) hint.textContent = t("newsLoading");

      const all = [];
      for (const f of FEEDS) {
        try {
          const part = await fetchFeedItems(f);
          part.slice(0, 12).forEach(x => all.push(x));
        } catch {
          // skip feed
        }
      }

      all.sort((a, b) => (Date.parse(b.pubDate || "") || 0) - (Date.parse(a.pubDate || "") || 0));
      const top = all.slice(0, 24);

      saveNewsCache(top);
      renderNewsScreen();
      if (!silent) toast(state.lang === "he" ? "עודכן ✅" : "Обновлено ✅");
    } catch {
      const cached = loadNewsCache();
      renderNewsCards(cached.items);
      if (hint) hint.textContent = t("newsCacheShown");
    } finally {
      if (btn) btn.disabled = false;
    }
  }

  function renderNewsScreen() {
    const cached = loadNewsCache();
    let items = cached.items || [];

    const src = $("#newsSourceSelect")?.value || "all";
    if (src !== "all") items = items.filter(x => x.feedId === src);

    const q = ($("#newsSearch")?.value || "").trim().toLowerCase();
    if (q) {
      items = items.filter(x =>
        (x.title || "").toLowerCase().includes(q) ||
        (x.desc || "").toLowerCase().includes(q) ||
        (x.feedName || "").toLowerCase().includes(q)
      );
    }

    renderNewsCards(items);
    const hint = $("#newsHint");
    if (hint && !items.length) hint.textContent = t("newsEmpty");
  }

  function clearNewsCache() {
    localStorage.removeItem(NEWS_LS_KEY);
    renderNewsCards([]);
    toast(state.lang === "he" ? "נוקה ✅" : "Кэш очищен ✅");
  }

  // ---------------------------
  // UI text / i18n apply
  // ---------------------------
  function applyI18n() {
    // top / home
    if ($("#brandSubtitle")) $("#brandSubtitle").textContent = t("brandSubtitle");
    if ($("#homeLead")) $("#homeLead").textContent = t("homeLead");
    if ($("#openCourses")) $("#openCourses").textContent = t("openCourses");
    if ($("#openWiki")) $("#openWiki").textContent = t("openWiki");
    if ($("#quickTitle")) $("#quickTitle").textContent = t("quickTitle");
    if ($("#quickHint")) $("#quickHint").textContent = t("quickHint");
    if ($("#openWash")) $("#openWash").textContent = t("openAfterWash");
    if ($("#homeSectionTitle")) $("#homeSectionTitle").textContent = t("homeSectionTitle");

    // nav labels
    if ($("#navHome")) $("#navHome").textContent = t("navHome");
    if ($("#navNews")) $("#navNews").textContent = t("navNews");
    if ($("#navCourses")) $("#navCourses").textContent = t("navCourses");
    if ($("#navProgress")) $("#navProgress").textContent = t("navProgress");
    if ($("#navWiki")) $("#navWiki").textContent = t("navWiki");
    if ($("#navProfile")) $("#navProfile").textContent = t("navProfile");

    // courses
    if ($("#coursesTitle")) $("#coursesTitle").textContent = t("coursesTitle");
    if ($("#coursesSearch")) $("#coursesSearch").setAttribute("placeholder", t("coursesSearch"));
    const f = $("#coursesFilter");
    if (f && f.options?.length >= 4) {
      f.options[0].text = t("filterAll");
      f.options[1].text = t("filterFree");
      f.options[2].text = t("filterPaid");
      f.options[3].text = t("filterOwned");
    }

    // progress/wiki/profile/admin
    if ($("#progressTitle")) $("#progressTitle").textContent = t("progressTitle");
    if ($("#wikiTitle")) $("#wikiTitle").textContent = t("wikiTitle");
    if ($("#wikiSearch")) $("#wikiSearch").setAttribute("placeholder", t("wikiSearch"));
    if ($("#profileTitle")) $("#profileTitle").textContent = t("profileTitle");
    if ($("#resetProgress")) $("#resetProgress").textContent = t("resetProgress");
    if ($("#exportData")) $("#exportData").textContent = t("exportData");
    if ($("#profileHint")) $("#profileHint").textContent = t("profileHint");
    if ($("#ownedTitle")) $("#ownedTitle").textContent = t("ownedTitle");
    if ($("#adminTitle")) $("#adminTitle").textContent = t("adminTitle");

    // news
    if ($("#newsTitle")) $("#newsTitle").textContent = t("newsTitle");
    if ($("#newsRefreshBtn")) $("#newsRefreshBtn").textContent = t("newsRefresh");
    if ($("#newsClearBtn")) $("#newsClearBtn").textContent = t("newsClear");
    if ($("#newsSearch")) $("#newsSearch").setAttribute("placeholder", t("newsSearch"));
    if ($("#newsSourcesLabel")) $("#newsSourcesLabel").textContent = t("newsSources");
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
    if ($("#greeting")) $("#greeting").textContent = nowGreeting();

    const fromTg = tg ? (tg.initDataUnsafe?.user?.first_name || tg.initDataUnsafe?.user?.username) : null;
    const name = state.profile.name || fromTg || (state.lang === "he" ? "מאסטר" : "мастер");
    if ($("#username")) $("#username").textContent = name;
    if ($("#profileName")) $("#profileName").textContent = name;

    if ($("#profileMeta")) {
      $("#profileMeta").textContent = tg
        ? `@${tg.initDataUnsafe?.user?.username || "telegram"} • WebApp`
        : "Browser mode";
    }

    const gp = globalProgress();
    const ownedCount = DATA.courses.filter(c => isOwned(c.id)).length;
    const paidCount = DATA.courses.filter(c => c.price > 0).length;

    const statsEl = $("#homeStats");
    if (statsEl) {
      statsEl.innerHTML = `
        <div class="stat">
          <div class="stat__label">${escapeHtml(state.lang === "he" ? "התקדמות כללית" : "Общий прогресс")}</div>
          <div class="stat__value">${gp.pct}%</div>
        </div>
        <div class="stat">
          <div class="stat__label">${escapeHtml(state.lang === "he" ? "קורסים זמינים" : "Доступных курсов")}</div>
          <div class="stat__value">${ownedCount}</div>
        </div>
        <div class="stat">
          <div class="stat__label">${escapeHtml(state.lang === "he" ? "קורסים בתשלום" : "Платных курсов")}</div>
          <div class="stat__value">${paidCount}</div>
        </div>
      `;
    }

    const quick = [
      state.lang === "he" ? "1) בחר קורס והתחל שיעור" : "1) Выбери курс и начни урок",
      state.lang === "he" ? "2) סיים שיעור וסמן כהושלם" : "2) Закончи урок и отметь как пройденный",
      state.lang === "he" ? "3) עבר מבחן כדי לקבע ידע" : "3) Пройди тест, чтобы закрепить знания"
    ];
    if ($("#quickList")) $("#quickList").innerHTML = quick.map(x => `<div>${escapeHtml(x)}</div>`).join("");

    // recommended (first 3)
    const rec = DATA.courses.slice(0, 3);
    const recRoot = $("#homeRecommended");
    if (recRoot) {
      recRoot.innerHTML = rec.map(courseCardHTML).join("");
      $$("#homeRecommended .card").forEach(card => {
        card.addEventListener("click", () => openCourse(card.dataset.id));
      });
    }
  }

  // ---------------------------
  // Render: Courses
  // ---------------------------
  function courseCardHTML(course) {
    const owned = isOwned(course.id);
    const p = courseProgress(course.id);

    const priceBadge = course.price === 0 ? t("free") : `${course.price} ₪`;
    const payBadge = course.price === 0 ? t("free") : t("paid");
    const lockBadge = owned ? t("accessGranted") : t("locked");

    return `
      <article class="card" data-id="${escapeHtml(course.id)}">
        <div class="card__title">${escapeHtml(course.title[state.lang])}</div>
        <p class="card__desc">${escapeHtml(course.desc[state.lang])}</p>
        <div class="badges">
          <span class="badge">${escapeHtml(priceBadge)}</span>
          <span class="badge ${course.price === 0 ? "good" : "pay"}">${escapeHtml(payBadge)}</span>
          <span class="badge">${escapeHtml(course.level[state.lang])}</span>
          <span class="badge">${course.lessons.length} ${escapeHtml(t("lessons"))}</span>
          <span class="badge ${owned ? "good" : "lock"}">${escapeHtml(lockBadge)}</span>
          <span class="badge">${escapeHtml(state.lang === "he" ? "הושלם" : "Пройдено")}: ${p.done}/${p.total} • ${p.pct}%</span>
        </div>
      </article>
    `;
  }

  function renderCourses() {
    const root = $("#coursesRoot");
    if (!root) return;

    const q = ($("#coursesSearch")?.value || "").trim().toLowerCase();
    const filter = $("#coursesFilter")?.value || "all";

    const list = DATA.courses.filter(c => {
      const matchQ = !q ||
        c.title[state.lang].toLowerCase().includes(q) ||
        c.desc[state.lang].toLowerCase().includes(q);

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
  // Course / Lesson / Test
  // ---------------------------
  function openCourse(courseId) {
    const course = getCourse(courseId);
    if (!course) return;

    current.courseId = courseId;
    current.lessonId = null;

    showScreen("course");
    renderCourse(courseId);
  }

  function renderCourse(courseId) {
    const course = getCourse(courseId);
    if (!course) return;

    if ($("#courseTitle")) $("#courseTitle").textContent = course.title[state.lang];

    const owned = isOwned(courseId);
    const p = courseProgress(courseId);
    const priceLabel = course.price === 0 ? t("free") : `${course.price} ₪`;

    const courseRoot = $("#courseRoot");
    if (courseRoot) {
      courseRoot.innerHTML = `
        <div class="kicker">${escapeHtml(course.category[state.lang])}</div>
        <div class="hr"></div>
        <div class="badges">
          <span class="badge">${escapeHtml(priceLabel)}</span>
          <span class="badge">${escapeHtml(course.level[state.lang])}</span>
          <span class="badge">${escapeHtml(owned ? t("accessGranted") : t("accessMissing"))}</span>
          <span class="badge">${escapeHtml(state.lang === "he" ? "הושלם" : "Пройдено")}: ${p.done}/${p.total} • ${p.pct}%</span>
        </div>
        <div class="hr"></div>
        ${(!owned && course.price > 0) ? `
          <div class="result bad">
            <div class="result__title">${escapeHtml(t("locked"))}</div>
            <div class="result__text">${escapeHtml(state.lang === "he"
              ? "כדי לפתוח — קנה גישה או בקש אדמין אחרי תשלום."
              : "Чтобы открыть — купи доступ или попроси админа выдать доступ после оплаты."
            )}</div>
          </div>
          <div class="row" style="margin-top:10px;">
            <button class="btn btn-primary" id="buyCourseBtn" type="button">${escapeHtml(t("buy"))} • ${escapeHtml(priceLabel)}</button>
          </div>
          <div class="hint">${escapeHtml(t("adminInvoiceHint"))}</div>
        ` : `
          <div class="row">
            <button class="btn btn-secondary" id="continueCourseBtn" type="button">${escapeHtml(t("continue"))}</button>
          </div>
        `}
      `;
    }

    // lessons
    const listEl = $("#lessonsList");
    if (!listEl) return;

    listEl.innerHTML = course.lessons.map((l, idx) => {
      const done = lessonDone(l.id);
      const hasTest = Boolean(l.test);
      const testState = state.progress[l.id]?.test;
      const testBadge = hasTest ? (testState?.passed ? t("passed") : t("test")) : "";

      return `
        <div class="list-item" data-lesson="${escapeHtml(l.id)}">
          <div>
            <div class="list-item__title">${idx + 1}. ${escapeHtml(l.title[state.lang])}</div>
            <div class="list-item__meta">
              ${l.durationMin} ${escapeHtml(t("minutes"))}
              ${hasTest ? ` • ${escapeHtml(testBadge)}` : ""}
              ${done ? ` • ✅ ${escapeHtml(t("done"))}` : ""}
            </div>
          </div>
          <div class="badges" style="margin-top:0;">
            <span class="badge ${owned ? "good" : "lock"}">${escapeHtml(owned ? t("open") : t("locked"))}</span>
          </div>
        </div>
      `;
    }).join("");

    $$("#lessonsList .list-item").forEach(item => {
      item.addEventListener("click", () => {
        if (!owned && course.price > 0) {
          toast(t("locked"));
          return;
        }
        openLesson(courseId, item.dataset.lesson);
      });
    });

    // buttons
    $("#buyCourseBtn")?.addEventListener("click", () => purchaseFlow(course));
    $("#continueCourseBtn")?.addEventListener("click", () => {
      const next = course.lessons.find(l => !lessonDone(l.id)) || course.lessons[0];
      openLesson(courseId, next.id);
    });
  }

  function purchaseFlow(course) {
    // invoice support (если добавишь invoiceUrl)
    if (tg && typeof tg.openInvoice === "function" && course.invoiceUrl) {
      try {
        tg.openInvoice(course.invoiceUrl, (status) => {
          if (status === "paid") grantAccess(course.id, "invoice");
        });
        return;
      } catch {}
    }

    // demo fallback
    if (DATA.settings.ALLOW_DEMO_PURCHASE) {
      const ok = confirm(state.lang === "he"
        ? `דמו: לפתוח גישה ל-“${course.title.he}”?`
        : `Демо: открыть доступ к “${course.title.ru}”?`
      );
      if (ok) grantAccess(course.id, "demo");
      return;
    }

    alert(t("invoiceNotReady"));
  }

  function openLesson(courseId, lessonId) {
    current.courseId = courseId;
    current.lessonId = lessonId;
    showScreen("lesson");
    renderLesson(courseId, lessonId);
  }

  function renderLesson(courseId, lessonId) {
    const course = getCourse(courseId);
    const lesson = getLesson(courseId, lessonId);
    if (!course || !lesson) return;

    if ($("#lessonTitle")) $("#lessonTitle").textContent = lesson.title[state.lang];

    const done = lessonDone(lessonId);
    const testState = state.progress[lessonId]?.test;

    const steps = lesson.steps?.[state.lang] || [];
    const checklist = lesson.checklist?.[state.lang] || [];
    const text = lesson.text?.[state.lang] || "";

    const root = $("#lessonRoot");
    if (!root) return;

    root.innerHTML = `
      <div class="panel">
        <div class="kicker">${escapeHtml(course.title[state.lang])}</div>
        <div class="badges">
          <span class="badge">${lesson.durationMin} ${escapeHtml(t("minutes"))}</span>
          <span class="badge ${done ? "good" : ""}">${done ? "✅ " + escapeHtml(t("done")) : escapeHtml(state.lang === "he" ? "לא הושלם" : "Не пройден")}</span>
          ${lesson.test ? `<span class="badge">${escapeHtml(t("test"))}</span>` : ""}
          ${lesson.test && testState ? `<span class="badge">${escapeHtml(t("score"))}: ${testState.score}%</span>` : ""}
        </div>

        <div class="hr"></div>

        ${text ? `<div class="card__desc" style="white-space:pre-line;">${escapeHtml(text)}</div>` : ""}

        ${steps.length ? `
          <div class="hr"></div>
          <div class="h3">${escapeHtml(state.lang === "he" ? "שלבים" : "Шаги")}</div>
          <div class="list">
            ${steps.map(s => `<div class="list-item"><div class="list-item__title">${escapeHtml(s)}</div></div>`).join("")}
          </div>
        ` : ""}

        ${checklist.length ? `
          <div class="hr"></div>
          <div class="h3">${escapeHtml(state.lang === "he" ? "צ׳ק-ליסט" : "Чек-лист")}</div>
          <div class="list">
            ${checklist.map(s => `<div class="list-item"><div class="list-item__title">☑ ${escapeHtml(s)}</div></div>`).join("")}
          </div>
        ` : ""}

        <div class="hr"></div>

        <div class="row">
          ${lesson.test ? `<button class="btn btn-secondary" id="openTestBtn" type="button">${escapeHtml(testState?.passed ? t("retakeTest") : t("startTest"))}</button>` : ""}
          <button class="btn btn-primary" id="markDoneBtn" type="button">${escapeHtml(t("markDone"))}</button>
        </div>
      </div>
    `;

    $("#markDoneBtn")?.addEventListener("click", () => {
      setLessonDone(lessonId, true);
      toast(t("toastSaved"));
      renderAll();
      renderLesson(courseId, lessonId);
    });

    $("#openTestBtn")?.addEventListener("click", () => openTest(courseId, lessonId));
  }

  function openTest(courseId, lessonId) {
    current.courseId = courseId;
    current.lessonId = lessonId;
    showScreen("test");
    renderTest(courseId, lessonId);
  }

  function renderTest(courseId, lessonId) {
    const lesson = getLesson(courseId, lessonId);
    if (!lesson?.test) return;

    if ($("#testTitle")) $("#testTitle").textContent = `${t("test")} • ${lesson.title[state.lang]}`;

    const test = lesson.test;
    const root = $("#testRoot");
    if (!root) return;

    root.innerHTML = `
      <div class="panel">
        <div class="row">
          <button class="btn btn-primary" id="submitTest" type="button">${escapeHtml(state.lang === "he" ? "בדוק" : "Проверить")}</button>
          <button class="btn btn-ghost" id="clearTest" type="button">${escapeHtml(state.lang === "he" ? "נקה" : "Очистить")}</button>
        </div>

        <div class="hr"></div>

        <form id="testForm" class="list"></form>

        <div class="hr"></div>

        <div id="testResult"></div>
      </div>
    `;

    const form = $("#testForm");
    form.innerHTML = test.questions.map((q, qi) => {
      const qId = `q_${qi}`;
      const opts = q.options[state.lang];
      return `
        <div class="q">
          <div class="q__title">${qi + 1}. ${escapeHtml(q.text[state.lang])}</div>
          ${opts.map((opt, oi) => `
            <label class="opt">
              <input type="radio" name="${escapeHtml(qId)}" value="${oi}">
              <span>${escapeHtml(opt)}</span>
            </label>
          `).join("")}
        </div>
      `;
    }).join("");

    $("#submitTest")?.addEventListener("click", () => {
      const answers = [];
      test.questions.forEach((_, qi) => {
        const picked = form.querySelector(`input[name="q_${qi}"]:checked`);
        answers.push(picked ? Number(picked.value) : null);
      });

      const total = test.questions.length;
      let correct = 0;

      const breakdown = test.questions.map((q, i) => {
        const ok = answers[i] === q.correctIndex;
        if (ok) correct++;
        return { ok, q, picked: answers[i], correct: q.correctIndex };
      });

      const score = Math.round((correct / total) * 100);
      const passed = score >= (test.passScore || 70);

      setLessonTest(lessonId, passed, score);
      if (passed) setLessonDone(lessonId, true);

      const result = $("#testResult");
      result.innerHTML = `
        <div class="result ${passed ? "good" : "bad"}">
          <div class="result__title">${passed ? "✅ " + escapeHtml(t("passed")) : "❌ " + escapeHtml(t("notPassed"))}</div>
          <div class="result__text">${escapeHtml(t("score"))}: ${score}% • ${escapeHtml(state.lang === "he" ? "נכון" : "Верно")}: ${correct}/${total}</div>
        </div>

        <div class="hr"></div>

        ${breakdown.map((b, i) => {
          const opts = b.q.options[state.lang];
          const your = (b.picked == null) ? (state.lang === "he" ? "לא נבחר" : "не выбрано") : opts[b.picked];
          const right = opts[b.correct];
          return `
            <div class="result ${b.ok ? "good" : "bad"}">
              <div class="result__title">${b.ok ? "✅" : "❌"} ${i + 1}. ${escapeHtml(b.q.text[state.lang])}</div>
              <div class="result__text">${escapeHtml(state.lang === "he" ? "שלך" : "Твой")}: ${escapeHtml(your)} • ${escapeHtml(state.lang === "he" ? "נכון" : "Правильно")}: ${escapeHtml(right)}</div>
            </div>
          `;
        }).join("")}
      `;

      renderAll();
    });

    $("#clearTest")?.addEventListener("click", () => {
      $$("input[type=radio]", form).forEach(x => (x.checked = false));
      $("#testResult").innerHTML = "";
    });
  }

  // ---------------------------
  // Render: Progress
  // ---------------------------
  function renderProgress() {
    const root = $("#progressRoot");
    if (!root) return;

    const gp = globalProgress();
    const blocks = [];

    blocks.push(`
      <article class="card">
        <div class="card__title">${escapeHtml(state.lang === "he" ? "סיכום" : "Сводка")}</div>
        <p class="card__desc">${escapeHtml(state.lang === "he" ? "התקדמות כללית" : "Общий прогресс")}: ${gp.done}/${gp.total} • ${gp.pct}%</p>
        <div class="progressbar"><div style="width:${gp.pct}%;"></div></div>
      </article>
    `);

    DATA.courses.forEach(c => {
      const p = courseProgress(c.id);
      blocks.push(`
        <article class="card" data-course="${escapeHtml(c.id)}">
          <div class="card__title">${escapeHtml(c.title[state.lang])}</div>
          <p class="card__desc">${escapeHtml(c.desc[state.lang])}</p>
          <div class="badges">
            <span class="badge">${escapeHtml(c.category[state.lang])}</span>
            <span class="badge">${escapeHtml(c.level[state.lang])}</span>
            <span class="badge">${p.done}/${p.total} • ${p.pct}%</span>
            <span class="badge ${isOwned(c.id) ? "good" : "lock"}">${escapeHtml(isOwned(c.id) ? t("accessGranted") : t("locked"))}</span>
          </div>
          <div class="progressbar"><div style="width:${p.pct}%;"></div></div>
        </article>
      `);
    });

    root.innerHTML = blocks.join("");

    $$("#progressRoot .card[data-course]").forEach(card => {
      card.addEventListener("click", () => openCourse(card.dataset.course));
    });
  }

  // ---------------------------
  // Render: Wiki
  // ---------------------------
  function buildWikiCategories() {
    const select = $("#wikiCategory");
    if (!select) return;

    const unique = new Map();
    DATA.wiki.forEach(w => unique.set(w.categoryKey, w.category));

    select.innerHTML =
      `<option value="all">${escapeHtml(t("wikiAllCats"))}</option>` +
      Array.from(unique.entries()).map(([key, name]) =>
        `<option value="${escapeHtml(key)}">${escapeHtml(name[state.lang])}</option>`
      ).join("");
  }

  function renderWiki() {
    const root = $("#wikiRoot");
    if (!root) return;

    const q = ($("#wikiSearch")?.value || "").trim().toLowerCase();
    const cat = $("#wikiCategory")?.value || "all";

    const items = DATA.wiki.filter(w => {
      const matchCat = (cat === "all") || (w.categoryKey === cat);
      if (!matchCat) return false;
      const matchQ = !q ||
        w.title[state.lang].toLowerCase().includes(q) ||
        w.body[state.lang].toLowerCase().includes(q);
      return matchQ;
    });

    root.innerHTML = items.map(w => `
      <article class="card" data-wiki="${escapeHtml(w.id)}">
        <div class="card__title">${escapeHtml(w.title[state.lang])}</div>
        <p class="card__desc">${escapeHtml(w.preview[state.lang])}</p>
        <div class="badges">
          <span class="badge">${escapeHtml(w.category[state.lang])}</span>
          ${w.tags[state.lang].slice(0,4).map(tag => `<span class="badge">${escapeHtml(tag)}</span>`).join("")}
        </div>
      </article>
    `).join("");

    $$("#wikiRoot .card").forEach(card => {
      card.addEventListener("click", () => openWikiItem(card.dataset.wiki));
    });
  }

  function openWikiItem(id) {
    const w = DATA.wiki.find(x => x.id === id);
    if (!w) return;

    // reuse course screen as article viewer
    current.courseId = null;
    current.lessonId = null;

    if ($("#courseTitle")) $("#courseTitle").textContent = w.title[state.lang];

    const courseRoot = $("#courseRoot");
    if (courseRoot) {
      courseRoot.innerHTML = `
        <div class="kicker">${escapeHtml(w.category[state.lang])}</div>
        <div class="badges">
          ${w.tags[state.lang].slice(0, 8).map(tag => `<span class="badge">${escapeHtml(tag)}</span>`).join("")}
        </div>
        <div class="hr"></div>
        <div class="card__desc" style="white-space:pre-line;">${escapeHtml(w.body[state.lang])}</div>
      `;
    }
    if ($("#lessonsList")) $("#lessonsList").innerHTML = "";

    showScreen("course");
  }

  // ---------------------------
  // Render: Profile + Owned
  // ---------------------------
  function renderProfile() {
    const root = $("#ownedRoot");
    if (!root) return;

    const owned = DATA.courses.filter(c => isOwned(c.id));
    root.innerHTML = owned.length ? owned.map(c => `
      <div class="list-item" data-course="${escapeHtml(c.id)}">
        <div>
          <div class="list-item__title">${escapeHtml(c.title[state.lang])}</div>
          <div class="list-item__meta">${escapeHtml(c.category[state.lang])} • ${escapeHtml(c.price === 0 ? t("free") : `${c.price} ₪`)}</div>
        </div>
        <span class="badge good">${escapeHtml(t("open"))}</span>
      </div>
    `).join("") : `<div class="hint">${escapeHtml(state.lang === "he" ? "עדיין אין גישות." : "Пока нет доступов.")}</div>`;

    $$("#ownedRoot .list-item").forEach(item => {
      item.addEventListener("click", () => openCourse(item.dataset.course));
    });
  }

  // ---------------------------
  // Admin
  // ---------------------------
  const ADMIN_PIN = "7777"; // поменяй
  let brandTapCount = 0;
  let brandTapTimer = null;

  function openAdmin() {
    showScreen("admin");
    renderAdmin();
  }

  function renderAdmin() {
    const root = $("#adminRoot");
    if (!root) return;

    if (!state.admin.unlocked) {
      root.innerHTML = `
        <div class="h3">${escapeHtml(t("adminEnterPin"))}</div>
        <div class="row">
          <input class="input" id="adminPin" placeholder="${escapeHtml(t("adminPinPlaceholder"))}">
          <button class="btn btn-primary" id="adminLoginBtn" type="button">${escapeHtml(t("adminLogin"))}</button>
        </div>
        <div class="hint">${escapeHtml(t("adminSetPinInfo"))}</div>
      `;
      $("#adminLoginBtn")?.addEventListener("click", () => {
        const v = ($("#adminPin")?.value || "").trim();
        if (v === ADMIN_PIN) {
          state.admin.unlocked = true;
          saveState();
          toast(t("toastUnlocked"));
          renderAdmin();
        } else toast(t("adminWrongPin"));
      });
      return;
    }

    root.innerHTML = `
      <div class="h3">${escapeHtml(t("adminPanel"))}</div>
      <div class="hint">${escapeHtml(t("adminInvoiceHint"))}</div>

      <div class="hr"></div>

      <div class="h3">${escapeHtml(t("adminUnlockByCourse"))}</div>
      <div class="row">
        <select class="select" id="adminCourseSelect">
          ${DATA.courses.filter(c => c.price > 0).map(c => `<option value="${escapeHtml(c.id)}">${escapeHtml(c.title[state.lang])} (${c.price}₪)</option>`).join("")}
        </select>
        <button class="btn btn-primary" id="adminGrantBtn" type="button">${escapeHtml(state.lang === "he" ? "תן גישה" : "Выдать доступ")}</button>
      </div>

      <div class="row" style="margin-top:10px;">
        <button class="btn btn-secondary" id="adminUnlockAll" type="button">${escapeHtml(t("adminUnlockAll"))}</button>
        <button class="btn btn-ghost" id="adminLockAll" type="button">${escapeHtml(t("adminLockAll"))}</button>
        <button class="btn btn-ghost" id="adminLogout" type="button">${escapeHtml(state.lang === "he" ? "התנתק" : "Выйти")}</button>
      </div>

      <div class="hr"></div>

      <div class="h3">${escapeHtml(state.lang === "he" ? "רכישות (לוקלי)" : "Покупки (локально)")}</div>
      <pre class="code" id="adminDump"></pre>

      <div class="row">
        <button class="btn btn-ghost" id="copyDump" type="button">${escapeHtml(state.lang === "he" ? "העתק" : "Копировать")}</button>
      </div>
    `;

    const dumpEl = $("#adminDump");
    if (dumpEl) dumpEl.textContent = JSON.stringify({ purchased: state.purchased, progress: state.progress }, null, 2);

    $("#adminGrantBtn")?.addEventListener("click", () => {
      const cid = $("#adminCourseSelect")?.value;
      if (cid) grantAccess(cid, "manual");
      renderAdmin();
    });

    $("#adminUnlockAll")?.addEventListener("click", () => {
      DATA.courses.filter(c => c.price > 0).forEach(c => grantAccess(c.id, "manual"));
      renderAdmin();
    });

    $("#adminLockAll")?.addEventListener("click", () => {
      state.purchased = {};
      saveState();
      toast(state.lang === "he" ? "ננעל ✅" : "Закрыто ✅");
      renderAll();
      renderAdmin();
    });

    $("#adminLogout")?.addEventListener("click", () => {
      state.admin.unlocked = false;
      saveState();
      renderAdmin();
    });

    $("#copyDump")?.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText($("#adminDump")?.textContent || "");
        toast(t("toastCopied"));
      } catch {
        alert($("#adminDump")?.textContent || "");
      }
    });
  }

  // ---------------------------
  // Render All
  // ---------------------------
  function renderAll() {
    renderHome();
    renderCourses();
    renderProgress();
    buildWikiCategories();
    renderWiki();
    renderProfile();
    if (current.tab === "news") renderNewsScreen();
    if (current.tab === "course" && current.courseId) renderCourse(current.courseId);
    if (current.tab === "lesson" && current.courseId && current.lessonId) renderLesson(current.courseId, current.lessonId);
    if (current.tab === "test" && current.courseId && current.lessonId) renderTest(current.courseId, current.lessonId);
    if (current.tab === "admin") renderAdmin();
  }

  // ---------------------------
  // Events
  // ---------------------------
  function bindEvents() {
    // bottom nav
    navItems.forEach(btn => {
      btn.addEventListener("click", () => {
        const tab = btn.dataset.tab;
        showScreen(tab);
        renderAll();
        if (tab === "news") {
          // if cache empty -> silent refresh
          const cached = loadNewsCache();
          if (!cached.items?.length) refreshNews({ silent: true });
        }
      });
    });

    // close
    $("#closeBtn")?.addEventListener("click", () => {
      if (tg) safe(() => tg.close());
    });

    // language toggle
    $("#langToggle")?.addEventListener("click", () => {
      setLang(state.lang === "ru" ? "he" : "ru");
      $("#langToggle").textContent = (state.lang === "he") ? "HE" : "RU";
    });

    // home quick links
    $("#openCourses")?.addEventListener("click", () => { showScreen("courses"); renderAll(); });
    $("#openWiki")?.addEventListener("click", () => { showScreen("wiki"); renderAll(); });

    // wash -> unlock first unlockOnWash or first paid
    $("#openWash")?.addEventListener("click", () => {
      const c = DATA.courses.find(x => x.unlockOnWash) || DATA.courses.find(x => x.price > 0);
      if (c) grantAccess(c.id, "manual");
    });

    // courses search/filter
    $("#coursesSearch")?.addEventListener("input", renderCourses);
    $("#coursesFilter")?.addEventListener("change", renderCourses);

    // back buttons
    $("#backToCourses")?.addEventListener("click", () => { showScreen("courses"); renderAll(); });
    $("#backToCourse")?.addEventListener("click", () => { showScreen("course"); renderCourse(current.courseId); });
    $("#backToLesson")?.addEventListener("click", () => { showScreen("lesson"); renderLesson(current.courseId, current.lessonId); });
    $("#backFromAdmin")?.addEventListener("click", () => { showScreen("profile"); renderAll(); });

    // wiki
    $("#wikiSearch")?.addEventListener("input", renderWiki);
    $("#wikiCategory")?.addEventListener("change", renderWiki);

    // profile actions
    $("#resetProgress")?.addEventListener("click", () => {
      const ok = confirm(state.lang === "he" ? "לאפס את ההתקדמות?" : "Сбросить прогресс?");
      if (!ok) return;
      state.progress = {};
      saveState();
      toast(t("toastReset"));
      renderAll();
    });

    $("#exportData")?.addEventListener("click", async () => {
      const payload = JSON.stringify({ state, exportedAt: new Date().toISOString() }, null, 2);
      try {
        await navigator.clipboard.writeText(payload);
        toast(t("toastCopied"));
      } catch {
        alert(payload);
      }
    });

    $("#openAdminFromProfile")?.addEventListener("click", openAdmin);

    // admin easter (7 taps)
    $("#brandTap")?.addEventListener("click", () => {
      brandTapCount += 1;
      clearTimeout(brandTapTimer);
      brandTapTimer = setTimeout(() => { brandTapCount = 0; }, 1200);
      if (brandTapCount >= 7) {
        brandTapCount = 0;
        openAdmin();
      }
    });

    // news actions
    $("#newsRefreshBtn")?.addEventListener("click", () => refreshNews({ silent: false }));
    $("#newsClearBtn")?.addEventListener("click", clearNewsCache);
    $("#newsSearch")?.addEventListener("input", renderNewsScreen);
    $("#newsSourceSelect")?.addEventListener("change", renderNewsScreen);
  }

  // ---------------------------
  // Boot
  // ---------------------------
  function boot() {
    if (!["ru","he"].includes(state.lang)) state.lang = "ru";
    applyLangDir();
    applyI18n();

    // initial
    $("#langToggle") && ($("#langToggle").textContent = (state.lang === "he") ? "HE" : "RU");

    showScreen("home");
    bindEvents();
    renderAll();
  }

  document.addEventListener("DOMContentLoaded", boot);
})();
