/* MR Detailing Academy — Telegram WebApp SPA (stable v4)
   Tabs (4): Home / Courses / Support / Wiki
   Profile is accessed from top bar (👤), not a tab.
   RU/HE + RTL, Noto Sans Hebrew for Hebrew.
   Courses are content-driven (data in this file for now).
   Paid access: demo/manual (client-side). For real payments connect Telegram Invoice via backend later.
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

  const LS_KEY = "mr_academy_state_v4";
  const NEWS_LS_KEY = "mr_academy_news_cache_v1";

  function escapeHtml(str) {
    return String(str ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  // ---------------------------
  // State
  // ---------------------------
  const state = loadState();

  function loadState() {
    const base = {
      lang: "ru",
      profile: { name: null },
      access: { purchased: {} }, // courseId -> {at, method}
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

  function deepMerge(a, b) {
    if (!b || typeof b !== "object") return a;
    const out = Array.isArray(a) ? a.slice() : { ...a };
    for (const k of Object.keys(b)) {
      if (b[k] && typeof b[k] === "object" && !Array.isArray(b[k])) {
        out[k] = deepMerge(out[k] ?? {}, b[k]);
      } else out[k] = b[k];
    }
    return out;
  }

  function saveState() {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  }

  // ---------------------------
  // i18n
  // ---------------------------
  const I18N = {
    ru: {
      brandSubtitle: "Внутренний мир детейлинга",
      homeLead: "Курсы, чек-листы и база знаний — без мусора. Чисто и по делу.",
      homeSectionTitle: "Рекомендуемые курсы",
      openCourses: "Открыть курсы",
      openWiki: "Открыть вики",

      navHome: "Главная",
      navCourses: "Курсы",
      navSupport: "Сопровождение",
      navWiki: "Вики",

      greetingMorning: "Доброе утро,",
      greetingDay: "Добрый день,",
      greetingEvening: "Добрый вечер,",
      greetingNight: "Доброй ночи,",

      newsBlockTitle: "Новости и обновления",
      newsBlockSubtitle: "Коротко и по делу: новинки, методы, продукты (RSS).",
      newsSearch: "Поиск",
      newsRefresh: "Обновить",
      newsLoading: "Загружаю…",
      newsEmpty: "Пока нет новостей. Нажми «Обновить».",
      newsCacheShown: "Показан кеш (если сеть не отвечает).",

      coursesTitle: "Курсы",
      coursesSearch: "Поиск по курсам…",
      filterAll: "Все",
      filterFree: "Бесплатные",
      filterPaid: "Платные",
      filterOwned: "Доступные мне",

      free: "Бесплатно",
      locked: "Закрыто",
      open: "Открыть",
      buy: "Купить доступ",
      accessGranted: "Доступ открыт",
      accessMissing: "Нет доступа",

      back: "← Назад",
      lessons: "уроков",
      minutes: "мин",

      supportTitle: "Сопровождение",
      supportSubtitle: "Помогаем по технологиям, химии, пастам, инструменту и ошибкам. Чем точнее опишешь — тем точнее ответ.",
      supportFormTitle: "Заявка на помощь",
      supportSent: "Текст заявки отправлен в Telegram (или скопирован).",
      supportCopied: "Текст заявки скопирован ✅",
      supportHint: "Совет: добавь фото/видео в чат, чтобы ответ был точнее.",

      wikiTitle: "Детейлинг-вики",
      wikiSearch: "Поиск: полировка, PPF, керамика, химчистка",
      wikiAllCats: "Все категории",

      profileTitle: "Профиль",
      accessTitle: "Доступы",
      export: "Экспорт",
      adminEnterPin: "Введите PIN администратора",
      adminLogin: "Войти",
      adminWrongPin: "Неверный PIN",
      adminPanel: "Админ-панель",
      adminGrant: "Выдать доступ",
      adminLockAll: "Сбросить доступы",
      adminLogout: "Выйти из админа",
      copied: "Скопировано ✅-",
      resetDone: "Данные сброшены ✅",
      invoiceNotReady: "Авто-оплата будет позже (нужен бэкенд). Сейчас выдавай доступ вручную."
    },

    he: {
      brandSubtitle: "עולם הדיטלינג מבפנים",
      homeLead: "קורסים, צ׳ק-ליסטים ובסיס ידע — בלי רעש. נקי ולעניין.",
      homeSectionTitle: "קורסים מומלצים",
      openCourses: "פתח קורסים",
      openWiki: "פתח ויקי",

      navHome: "בית",
      navCourses: "קורסים",
      navSupport: "ליווי",
      navWiki: "ויקי",

      greetingMorning: "בוקר טוב,",
      greetingDay: "צהריים טובים,",
      greetingEvening: "ערב טוב,",
      greetingNight: "לילה טוב,",

      newsBlockTitle: "חדשות ועדכונים",
      newsBlockSubtitle: "קצר ולעניין: מוצרים, שיטות וטיפים (RSS).",
      newsSearch: "חיפוש",
      newsRefresh: "רענן",
      newsLoading: "טוען…",
      newsEmpty: "אין חדשות עדיין. לחץ “רענן”.",
      newsCacheShown: "מוצג מטמון (אם הרשת לא זמינה).",

      coursesTitle: "קורסים",
      coursesSearch: "חיפוש קורסים…",
      filterAll: "הכול",
      filterFree: "חינמי",
      filterPaid: "בתשלום",
      filterOwned: "יש לי גישה",

      free: "חינמי",
      locked: "נעול",
      open: "פתח",
      buy: "קנה גישה",
      accessGranted: "גישה פתוחה",
      accessMissing: "אין גישה",

      back: "← חזרה",
      lessons: "שיעורים",
      minutes: "דק׳",

      supportTitle: "ליווי",
      supportSubtitle: "עזרה בטכנולוגיות, כימיה, פדים/פסטות, כלים וטעויות. ככל שתפרט יותר — התשובה תהיה מדויקת יותר.",
      supportFormTitle: "בקשת עזרה",
      supportSent: "הטקסט נשלח לטלגרם (או הועתק).",
      supportCopied: "הועתק ✅",
      supportHint: "טיפ: צרף תמונה/וידאו בצ׳אט כדי לקבל תשובה מדויקת.",

      wikiTitle: "ויקי דיטלינג",
      wikiSearch: "חיפוש: פוליש, PPF, קרמי…",
      wikiAllCats: "כל הקטגוריות",

      profileTitle: "פרופיל",
      accessTitle: "גישות",
      export: "ייצוא",
      adminEnterPin: "הזן PIN אדמין",
      adminLogin: "התחבר",
      adminWrongPin: "PIN שגוי",
      adminPanel: "לוח אדמין",
      adminGrant: "תן גישה",
      adminLockAll: "אפס גישות",
      adminLogout: "התנתק מאדמין",
      copied: "הועתק ✅",
      resetDone: "אופס ✅",
      invoiceNotReady: "תשלום אוטומטי יגיע בהמשך (צריך שרת). כרגע תן גישה ידנית."
    }
  };

  function t(key) {
    const lang = state.lang === "he" ? "he" : "ru";
    return I18N[lang]?.[key] ?? key;
  }

  // ---------------------------
  // RTL / language
  // ---------------------------
  function applyLangDir() {
    const lang = (state.lang === "he") ? "he" : "ru";
    document.documentElement.lang = lang;
    document.documentElement.dir = (lang === "he") ? "rtl" : "ltr";
    document.documentElement.classList.toggle("lang-he", lang === "he");
  }

  function setLang(lang) {
    state.lang = (lang === "he") ? "he" : "ru";
    saveState();
    applyLangDir();
    applyI18n();
    renderAll();
  }

  // ---------------------------
  // Data (content)
  // ---------------------------
  const DATA = {
    feeds: [
      { id: "autogeek", name: "Autogeek", url: "https://www.autogeekonline.net/feed/" },
      { id: "detailedimage", name: "Detailed Image", url: "https://www.detailedimage.com/Ask-a-Pro/feed/" }
    ],
    courses: [
      {
        id: "intro_free",
        price: 0,
        level: { ru: "Новичок", he: "מתחיל" },
        category: { ru: "База", he: "בסיס" },
        title: { ru: "Введение в детейлинг", he: "מבוא לדיטלינג" },
        desc: { ru: "Термины, безопасная мойка, логика процессов. Без воды.", he: "מושגים, שטיפה בטוחה והיגיון תהליכים — בלי מים." },
        lessons: [
          {
            id: "l_intro_1",
            durationMin: 8,
            title: { ru: "Что такое детейлинг", he: "מה זה דיטלינג" },
            body: {
              ru: "Детейлинг — это восстановление + защита.\n\nГлавный принцип: минимизировать риск.\n• Чистая химия\n• Чистые полотенца\n• Правильные контакты\n\nЕсли хочешь — дальше добавим фото/видео и задания.",
              he: "דיטלינג הוא שיקום + הגנה.\n\nעקרון מרכזי: למזער סיכון.\n• כימיה נקייה\n• מגבות נקיות\n• מגע נכון\n\nאפשר להוסיף בהמשך תמונות/וידאו ומשימות."
            },
            bullets: {
              ru: ["Детейлинг ≠ просто мойка", "Контроль риска важнее скорости", "План работ до старта"],
              he: ["דיטלינג ≠ רק שטיפה", "ניהול סיכון חשוב יותר ממהירות", "תכנית עבודה לפני התחלה"]
            }
          },
          {
            id: "l_intro_2",
            durationMin: 10,
            title: { ru: "Безопасная мойка (алгоритм)", he: "שטיפה בטוחה (אלגוריתם)" },
            body: {
              ru: "Схема:\n1) Предпена\n2) Смыв\n3) Контактная мойка (2 ведра)\n4) Сушка\n\nНе дави рукавицей. Меняй воду чаще. Не вытирай грязь всухую.",
              he: "סכמה:\n1) קצף מקדים\n2) שטיפה\n3) שטיפה במגע (2 דליים)\n4) ייבוש\n\nלא ללחוץ עם הכפפה. להחליף מים לעיתים. לא לנגב לכלוך יבש."
            },
            bullets: {
              ru: ["Грязь снимаем химией, не тряпкой", "Сушка — отдельный этап", "Чистые полотенца решают"],
              he: ["לכלוך מורידים בכימיה, לא במגבת", "ייבוש הוא שלב נפרד", "מגבות נקיות זה הכול"]
            }
          }
        ]
      },
      {
        id: "prep_paid",
        price: 199,
        level: { ru: "База+", he: "בסיס+" },
        category: { ru: "Кузов", he: "צבע" },
        title: { ru: "Подготовка кузова: деконтаминация и защита", he: "הכנת צבע: דה-קונטמינציה והגנה" },
        desc: { ru: "Айрон, битум, глина, обезжиривание, защита. Что, зачем и в каком порядке.", he: "איירון, זפת, קליי, IPA והגנה — מה, למה ובאיזה סדר." },
        invoiceUrl: null,
        lessons: [
          {
            id: "l_prep_1",
            durationMin: 14,
            title: { ru: "Деконтаминация: айрон и битум", he: "דה-קונטמינציה: איירון וזפת" },
            body: {
              ru: "Порядок:\n• Айрон (диски/кузов)\n• Битум точечно\n\nПравила:\n— не на горячей панели\n— не давать высохнуть\n— тщательно смывать",
              he: "סדר:\n• איירון (חישוקים/צבע)\n• זפת נקודתית\n\nכללים:\n— לא על משטח חם\n— לא לתת להתייבש\n— לשטוף היטב"
            },
            bullets: { ru: ["Сначала химия, потом глина", "Работаешь в тени", "Не экономь на смыве"], he: ["קודם כימיה ואז קליי", "עובדים בצל", "לא לחסוך בשטיפה"] }
          },
          {
            id: "l_prep_2",
            durationMin: 12,
            title: { ru: "Глина и обезжиривание", he: "קליי ו-IPA" },
            body: {
              ru: "Глина — это механика. Всегда с лубрикантом.\n\nПосле глины — смыв и обезжиривание (под защиту).",
              he: "קליי הוא מכני. תמיד עם לובריקנט.\n\nאחרי קליי — שטיפה ו-IPA (לפני הגנה)."
            },
            bullets: { ru: ["Не дави на глину", "Следи за чистотой кусочка", "Если упала — выбросить"], he: ["לא ללחוץ על הקליי", "לשמור על ניקיון", "נפל? לזרוק"] }
          }
        ]
      }
    ],
    wiki: [
      {
        id: "w_ppf",
        categoryKey: "protection",
        category: { ru: "Защита", he: "הגנה" },
        title: { ru: "PPF: что защищает и уход", he: "PPF: מה מגן ואיך מטפלים" },
        preview: { ru: "Сколы, пескоструй, само-восстановление. Уход и ошибки.", he: "מכות, אבנים, טיפול וטעויות." },
        body: { ru: "PPF — прозрачная полиуретановая плёнка.\n\nУход:\n• мягкая мойка\n• без агрессивных растворителей\n• аккуратная сушка", he: "PPF הוא סרט פוליאוריטן שקוף.\n\nתחזוקה:\n• שטיפה עדינה\n• בלי ממסים חזקים\n• ייבוש בעדינות" },
        tags: { ru: ["PPF", "плёнка", "защита"], he: ["PPF", "סרט", "הגנה"] }
      },
      {
        id: "w_iron",
        categoryKey: "chemistry",
        category: { ru: "Химия", he: "כימיה" },
        title: { ru: "Айрон-ремувер: правила", he: "איירון רימובר: כללים" },
        preview: { ru: "Почему “кровоточит”, где применять и чего нельзя.", he: "תגובה סגולה, איפה להשתמש וממה להיזהר." },
        body: { ru: "Айрон растворяет металлические вкрапления.\n\nНельзя:\n— на горячей панели\n— давать высохнуть\n— тереть грязной тряпкой", he: "איירון ממיס חלקיקי מתכת.\n\nאסור:\n— על משטח חם\n— לתת להתייבש\n— לשפשף במגבת מלוכלכת" },
        tags: { ru: ["айрон", "диски"], he: ["איירון", "חישוקים"] }
      }
    ],
    supportCards: [
      { key:"chem", icon:"🧪", title:{ru:"Подбор химии", he:"בחירת כימיה"}, desc:{ru:"Айрон/битум/АПС/шампуни — под задачу и бюджет.", he:"איירון/זפת/APC/שמפו — לפי משימה ותקציב."} },
      { key:"polish", icon:"🌀", title:{ru:"Полировка и круги", he:"פוליש ופדים"}, desc:{ru:"Система паст/пэдов, температура, голограммы, финиш.", he:"מערכת פסטות/פדים, חום, הולוגרמות ופיניש."} },
      { key:"interior", icon:"🧽", title:{ru:"Химчистка салона", he:"ניקוי פנים"}, desc:{ru:"Ткань/кожа, пятна, запахи, безопасность для детей.", he:"בד/עור, כתמים, ריחות, בטיחות לילדים."} },
      { key:"ppf", icon:"🛡️", title:{ru:"PPF/винил", he:"PPF/ויניל"}, desc:{ru:"Ошибки клея, подготовка, уход, сколы.", he:"טעויות הדבקה, הכנה, תחזוקה, פגיעות."} }
    ]
  };

  // ---------------------------
  // Access (client-side, demo/manual)
  // ---------------------------
  function isOwned(courseId) {
    const c = DATA.courses.find(x => x.id === courseId);
    if (!c) return false;
    if (c.price === 0) return true;
    return Boolean(state.access.purchased[courseId]);
  }

  function grantAccess(courseId, method = "manual") {
    state.access.purchased[courseId] = { at: new Date().toISOString(), method };
    saveState();
    toast(state.lang === "he" ? "נפתח ✅" : "Открыто ✅");
    renderAll();
  }

  // ---------------------------
  // Routing
  // ---------------------------
  const tabs = ["home","courses","support","wiki","course","lesson","profile"];
  const screen = new Map(tabs.map(s => [s, $(`#screen-${s}`)]));
  const navItems = $$(".nav__item");
  const current = { tab:"home", courseId:null, lessonId:null, returnTab:"home" };

  function showScreen(tab) {
    if (!screen.has(tab)) tab = "home";
    tabs.forEach(s => screen.get(s)?.classList.toggle("is-active", s === tab));
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
      Object.assign(el.style, {
        position:"fixed",
        left:"50%",
        bottom:"86px",
        transform:"translateX(-50%)",
        padding:"10px 12px",
        borderRadius:"14px",
        border:"1px solid rgba(255,255,255,.12)",
        background:"rgba(10,14,20,.88)",
        backdropFilter:"blur(10px)",
        color:"rgba(234,242,255,.95)",
        fontWeight:"900",
        boxShadow:"0 12px 30px rgba(0,0,0,.45)",
        zIndex:"999",
        opacity:"0"
      });
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.style.opacity = "1";
    toastTimer = setTimeout(() => { el.style.opacity = "0"; }, 2200);
  }

  // ---------------------------
  // News (RSS) on Home
  // ---------------------------
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

  async function fetchFeedItems(feed) {
    const api = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}`;
    const res = await fetch(api, { cache: "no-store" });
    if (!res.ok) throw new Error("rss failed");
    const data = await res.json();
    const items = Array.isArray(data.items) ? data.items : [];
    return items.map(it => ({
      id: it.guid || it.link || `${feed.id}_${Math.random().toString(16).slice(2)}`,
      feedName: feed.name,
      title: it.title || "",
      link: it.link || "",
      pubDate: it.pubDate || "",
      desc: (it.description || "").replace(/<[^>]*>/g, "").trim().slice(0, 220)
    }));
  }

  function renderNews(items) {
    const root = $("#newsRoot");
    const hint = $("#newsHint");
    if (!root) return;

    if (!items?.length) {
      root.innerHTML = "";
      if (hint) hint.textContent = t("newsEmpty");
      return;
    }

    const q = ($("#newsSearch")?.value || "").trim().toLowerCase();
    const filtered = q
      ? items.filter(n =>
          (n.title || "").toLowerCase().includes(q) ||
          (n.desc || "").toLowerCase().includes(q) ||
          (n.feedName || "").toLowerCase().includes(q)
        )
      : items;

    root.innerHTML = filtered.slice(0, 8).map(n => `
      <div class="news-item" data-link="${escapeHtml(n.link)}">
        <div class="news-item__title">${escapeHtml(n.title)}</div>
        <div class="news-item__meta">
          <span>${escapeHtml(n.feedName)}</span>
          <span>•</span>
          <span>${escapeHtml((n.pubDate || "").slice(0, 16).replace("T"," "))}</span>
        </div>
      </div>
    `).join("");

    $$("#newsRoot .news-item").forEach(el => {
      el.addEventListener("click", () => {
        const link = el.dataset.link;
        if (!link) return;
        if (tg && typeof tg.openLink === "function") tg.openLink(link);
        else window.open(link, "_blank");
      });
    });

    if (hint) hint.textContent = filtered.length ? "" : t("newsEmpty");
  }

  async function refreshNews({ silent=false } = {}) {
    const hint = $("#newsHint");
    const btn = $("#newsRefreshBtn");
    try {
      if (btn) btn.disabled = true;
      if (hint) hint.textContent = t("newsLoading");

      const all = [];
      for (const f of DATA.feeds) {
        try {
          const part = await fetchFeedItems(f);
          part.slice(0, 10).forEach(x => all.push(x));
        } catch {
          // skip
        }
      }

      all.sort((a,b) => (Date.parse(b.pubDate||"")||0) - (Date.parse(a.pubDate||"")||0));
      const top = all.slice(0, 24);
      saveNewsCache(top);
      renderNews(top);
      if (!silent) toast(state.lang === "he" ? "עודכן ✅" : "Обновлено ✅");
    } catch {
      const cached = loadNewsCache();
      renderNews(cached.items);
      if (hint) hint.textContent = t("newsCacheShown");
    } finally {
      if (btn) btn.disabled = false;
    }
  }

  // ---------------------------
  // Courses
  // ---------------------------
  function courseCardHTML(course) {
    const owned = isOwned(course.id);
    const priceBadge = course.price === 0 ? t("free") : `${course.price} ₪`;
    return `
      <article class="card" data-id="${escapeHtml(course.id)}">
        <div class="card__title">${escapeHtml(course.title[state.lang])}</div>
        <p class="card__desc">${escapeHtml(course.desc[state.lang])}</p>
        <div class="badges">
          <span class="badge">${escapeHtml(course.category[state.lang])}</span>
          <span class="badge">${escapeHtml(course.level[state.lang])}</span>
          <span class="badge ${course.price===0 ? "good" : "pay"}">${escapeHtml(priceBadge)}</span>
          <span class="badge ${owned ? "good" : "lock"}">${escapeHtml(owned ? t("accessGranted") : t("locked"))}</span>
          <span class="badge">${course.lessons.length} ${escapeHtml(t("lessons"))}</span>
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

  function openCourse(courseId) {
    const course = DATA.courses.find(c => c.id === courseId);
    if (!course) return;

    current.courseId = courseId;
    current.lessonId = null;
    current.returnTab = "courses";

    showScreen("course");
    renderCourse(courseId);
  }

  function renderCourse(courseId) {
    const course = DATA.courses.find(c => c.id === courseId);
    if (!course) return;

    if ($("#courseTitle")) $("#courseTitle").textContent = course.title[state.lang];

    const owned = isOwned(courseId);
    const priceLabel = course.price === 0 ? t("free") : `${course.price} ₪`;

    const courseRoot = $("#courseRoot");
    if (courseRoot) {
      courseRoot.innerHTML = `
        <div class="kicker">${escapeHtml(course.category[state.lang])}</div>
        <div class="hr"></div>
        <div class="badges">
          <span class="badge">${escapeHtml(priceLabel)}</span>
          <span class="badge">${escapeHtml(course.level[state.lang])}</span>
          <span class="badge ${owned ? "good" : "lock"}">${escapeHtml(owned ? t("accessGranted") : t("accessMissing"))}</span>
        </div>
        <div class="hr"></div>
        ${(!owned && course.price > 0) ? `
          <div class="card__desc" style="white-space:pre-line;">
            ${escapeHtml(state.lang === "he"
              ? "כדי לפתוח — קנה גישה או בקש ממנהל אחרי תשלום."
              : "Чтобы открыть — купи доступ или попроси админа выдать доступ после оплаты."
            )}
          </div>
          <div class="row" style="margin-top:10px;">
            <button class="btn btn-primary" id="buyCourseBtn" type="button">${escapeHtml(t("buy"))} • ${escapeHtml(priceLabel)}</button>
          </div>
          <div class="hint">${escapeHtml(t("invoiceNotReady"))}</div>
        ` : `
          <div class="card__desc">${escapeHtml(state.lang === "he"
            ? "בחר שיעור והתחל."
            : "Выбери урок и начинай."
          )}</div>
        `}
      `;
    }

    // lessons
    const listEl = $("#lessonsList");
    if (!listEl) return;

    listEl.innerHTML = course.lessons.map((l, idx) => `
      <div class="list-item" data-lesson="${escapeHtml(l.id)}">
        <div>
          <div class="list-item__title">${idx + 1}. ${escapeHtml(l.title[state.lang])}</div>
          <div class="list-item__meta">${l.durationMin} ${escapeHtml(t("minutes"))}</div>
        </div>
        <span class="badge ${owned || course.price===0 ? "good" : "lock"}">${escapeHtml((owned || course.price===0) ? t("open") : t("locked"))}</span>
      </div>
    `).join("");

    $$("#lessonsList .list-item").forEach(item => {
      item.addEventListener("click", () => {
        if (!owned && course.price > 0) { toast(t("locked")); return; }
        openLesson(courseId, item.dataset.lesson);
      });
    });

    $("#buyCourseBtn")?.addEventListener("click", () => purchaseFlow(course));
  }

  function purchaseFlow(course) {
    if (tg && typeof tg.openInvoice === "function" && course.invoiceUrl) {
      try {
        tg.openInvoice(course.invoiceUrl, (status) => {
          if (status === "paid") grantAccess(course.id, "invoice");
        });
        return;
      } catch {}
    }

    const ok = confirm(state.lang === "he"
      ? `דמו: לפתוח גישה ל-“${course.title.he}”?`
      : `Демо: открыть доступ к “${course.title.ru}”?`
    );
    if (ok) grantAccess(course.id, "demo");
  }

  function openLesson(courseId, lessonId) {
    current.courseId = courseId;
    current.lessonId = lessonId;
    showScreen("lesson");
    renderLesson(courseId, lessonId);
  }

  function renderLesson(courseId, lessonId) {
    const course = DATA.courses.find(c => c.id === courseId);
    const lesson = course?.lessons.find(l => l.id === lessonId);
    if (!course || !lesson) return;

    if ($("#lessonTitle")) $("#lessonTitle").textContent = lesson.title[state.lang];

    const bullets = lesson.bullets?.[state.lang] || [];
    const root = $("#lessonRoot");
    if (!root) return;

    root.innerHTML = `
      <div class="panel">
        <div class="kicker">${escapeHtml(course.title[state.lang])}</div>
        <div class="badges">
          <span class="badge">${lesson.durationMin} ${escapeHtml(t("minutes"))}</span>
          <span class="badge">${escapeHtml(course.level[state.lang])}</span>
        </div>

        <div class="hr"></div>

        <div class="card__desc" style="white-space:pre-line;">${escapeHtml(lesson.body?.[state.lang] || "")}</div>

        ${bullets.length ? `
          <div class="hr"></div>
          <div class="h3">${escapeHtml(state.lang === "he" ? "עיקרי הדברים" : "Ключевые пункты")}</div>
          <div class="list">
            ${bullets.map(x => `
              <div class="list-item">
                <div class="list-item__title">• ${escapeHtml(x)}</div>
              </div>
            `).join("")}
          </div>
        ` : ""}

        <div class="hr"></div>

        <div class="row">
          <button class="btn btn-secondary" id="nextLessonBtn" type="button">${escapeHtml(state.lang === "he" ? "השיעור הבא" : "Следующий урок")}</button>
        </div>
      </div>
    `;

    $("#nextLessonBtn")?.addEventListener("click", () => {
      const idx = course.lessons.findIndex(l => l.id === lessonId);
      const next = course.lessons[idx + 1];
      if (next) openLesson(courseId, next.id);
      else toast(state.lang === "he" ? "סיימת ✅" : "Ты дошёл до конца ✅");
    });
  }

  // ---------------------------
  // Wiki
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
      if (cat !== "all" && w.categoryKey !== cat) return false;
      if (!q) return true;
      return (
        w.title[state.lang].toLowerCase().includes(q) ||
        w.body[state.lang].toLowerCase().includes(q) ||
        (w.tags?.[state.lang] || []).some(tag => tag.toLowerCase().includes(q))
      );
    });

    root.innerHTML = items.map(w => `
      <article class="card" data-wiki="${escapeHtml(w.id)}">
        <div class="card__title">${escapeHtml(w.title[state.lang])}</div>
        <p class="card__desc">${escapeHtml(w.preview[state.lang])}</p>
        <div class="badges">
          <span class="badge">${escapeHtml(w.category[state.lang])}</span>
          ${(w.tags?.[state.lang] || []).slice(0,4).map(tag => `<span class="badge">${escapeHtml(tag)}</span>`).join("")}
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

    current.returnTab = "wiki";
    showScreen("lesson");

    if ($("#lessonTitle")) $("#lessonTitle").textContent = w.title[state.lang];

    const root = $("#lessonRoot");
    if (!root) return;

    root.innerHTML = `
      <div class="panel">
        <div class="kicker">${escapeHtml(w.category[state.lang])}</div>
        <div class="badges">
          ${(w.tags?.[state.lang] || []).slice(0, 10).map(tag => `<span class="badge">${escapeHtml(tag)}</span>`).join("")}
        </div>
        <div class="hr"></div>
        <div class="card__desc" style="white-space:pre-line;">${escapeHtml(w.body[state.lang])}</div>
      </div>
    `;
  }

  // ---------------------------
  // Support
  // ---------------------------
  function renderSupport() {
    if ($("#supportTitle")) $("#supportTitle").textContent = t("supportTitle");
    if ($("#supportSubtitle")) $("#supportSubtitle").textContent = t("supportSubtitle");
    if ($("#supportFormTitle")) $("#supportFormTitle").textContent = t("supportFormTitle");

    const cards = $("#supportCards");
    if (cards) {
      cards.innerHTML = DATA.supportCards.map(c => `
        <article class="card" data-support="${escapeHtml(c.key)}" style="cursor:default;">
          <div class="card__title">${escapeHtml(c.icon)} ${escapeHtml(c.title[state.lang])}</div>
          <p class="card__desc">${escapeHtml(c.desc[state.lang])}</p>
        </article>
      `).join("");
    }

    const hint = $("#supportHint");
    if (hint) hint.textContent = t("supportHint");
  }

  function buildSupportText() {
    const topic = ($("#supportTopic")?.value || "").trim();
    const msg = ($("#supportMessage")?.value || "").trim();
    const user = tg?.initDataUnsafe?.user;
    const who = user ? `@${user.username || ""} (${user.first_name || ""} ${user.last_name || ""})` : "Browser user";

    const header = state.lang === "he" ? "🛠️ בקשת ליווי (MR Academy)" : "🛠️ Заявка на сопровождение (MR Academy)";
    const lines = [
      header,
      `👤 ${who}`.trim(),
      topic ? `🧾 ${topic}` : "",
      "—",
      msg || (state.lang === "he" ? "אין תיאור." : "Нет описания."),
      "—",
      state.lang === "he" ? "📎 צרף כאן תמונה/וידאו בצ׳אט." : "📎 Прикрепи фото/видео в чате."
    ].filter(Boolean);

    return lines.join("\n");
  }

  async function sendSupport() {
    const text = buildSupportText();

    if (tg && typeof tg.sendData === "function") {
      try {
        tg.sendData(JSON.stringify({ type: "support", text }));
        toast(t("supportSent"));
        return;
      } catch {}
    }

    try {
      await navigator.clipboard.writeText(text);
      toast(t("supportCopied"));
    } catch {
      alert(text);
    }
  }

  async function copySupport() {
    const text = buildSupportText();
    try {
      await navigator.clipboard.writeText(text);
      toast(t("supportCopied"));
    } catch {
      alert(text);
    }
  }

  // ---------------------------
  // Profile + Admin
  // ---------------------------
  const ADMIN_PIN = "7777";
  let brandTapCount = 0;
  let brandTapTimer = null;

  function renderProfile() {
    if ($("#profileTitle")) $("#profileTitle").textContent = t("profileTitle");
    if ($("#accessTitle")) $("#accessTitle").textContent = t("accessTitle");
    if ($("#exportData")) $("#exportData").textContent = t("export");
    if ($("#resetLocal")) $("#resetLocal").textContent = t("resetLocal");
    if ($("#profileHint")) $("#profileHint").textContent = t("profileHint");

    const fromTg = tg ? (tg.initDataUnsafe?.user?.first_name || tg.initDataUnsafe?.user?.username) : null;
    const name = state.profile.name || fromTg || (state.lang === "he" ? "מאסטר" : "мастер");
    if ($("#profileName")) $("#profileName").textContent = name;

    if ($("#profileMeta")) {
      $("#profileMeta").textContent = tg ? `@${tg.initDataUnsafe?.user?.username || "telegram"} • WebApp` : "Browser mode";
    }

    const root = $("#ownedRoot");
    if (root) {
      const owned = DATA.courses.filter(c => isOwned(c.id));
      root.innerHTML = owned.length ? owned.map(c => `
        <div class="list-item" data-course="${escapeHtml(c.id)}">
          <div>
            <div class="list-item__title">${escapeHtml(c.title[state.lang])}</div>
            <div class="list-item__meta">${escapeHtml(c.category[state.lang])} • ${escapeHtml(c.price===0 ? t("free") : `${c.price} ₪`)}</div>
          </div>
          <span class="badge good">${escapeHtml(t("open"))}</span>
        </div>
      `).join("") : `<div class="hint">${escapeHtml(state.lang==="he" ? "אין גישות עדיין." : "Пока нет доступов.")}</div>`;

      $$("#ownedRoot .list-item").forEach(item => {
        item.addEventListener("click", () => openCourse(item.dataset.course));
      });
    }

    renderAdmin();
  }

  function renderAdmin() {
    const root = $("#adminRoot");
    if (!root) return;

    if (!state.admin.unlocked) {
      root.innerHTML = `
        <div class="hr"></div>
        <div class="h3">${escapeHtml(t("adminEnterPin"))}</div>
        <div class="row">
          <input class="input" id="adminPin" placeholder="PIN" />
          <button class="btn btn-primary" id="adminLoginBtn" type="button">${escapeHtml(t("adminLogin"))}</button>
        </div>
      `;
      $("#adminLoginBtn")?.addEventListener("click", () => {
        const v = ($("#adminPin")?.value || "").trim();
        if (v === ADMIN_PIN) {
          state.admin.unlocked = true;
          saveState();
          toast(state.lang==="he" ? "אדמין ✅" : "Админ ✅");
          renderAdmin();
        } else toast(t("adminWrongPin"));
      });
      return;
    }

    const paid = DATA.courses.filter(c => c.price > 0);
    root.innerHTML = `
      <div class="hr"></div>
      <div class="h3">${escapeHtml(t("adminPanel"))}</div>

      <div class="row">
        <select class="select" id="adminCourseSelect">
          ${paid.map(c => `<option value="${escapeHtml(c.id)}">${escapeHtml(c.title[state.lang])} (${c.price}₪)</option>`).join("")}
        </select>
        <button class="btn btn-primary" id="adminGrantBtn" type="button">${escapeHtml(t("adminGrant"))}</button>
      </div>

      <div class="row" style="margin-top:10px;">
        <button class="btn btn-ghost" id="adminLockAllBtn" type="button">${escapeHtml(t("adminLockAll"))}</button>
        <button class="btn btn-ghost" id="adminLogoutBtn" type="button">${escapeHtml(t("adminLogout"))}</button>
      </div>
    `;

    $("#adminGrantBtn")?.addEventListener("click", () => {
      const cid = $("#adminCourseSelect")?.value;
      if (cid) grantAccess(cid, "manual");
    });

    $("#adminLockAllBtn")?.addEventListener("click", () => {
      state.access.purchased = {};
      saveState();
      toast(state.lang==="he" ? "אופס ✅" : "Сброшено ✅");
      renderAll();
    });

    $("#adminLogoutBtn")?.addEventListener("click", () => {
      state.admin.unlocked = false;
      saveState();
      renderAdmin();
    });
  }

  async function exportData() {
    const payload = JSON.stringify({ state, exportedAt: new Date().toISOString() }, null, 2);
    try {
      await navigator.clipboard.writeText(payload);
      toast(t("copied"));
    } catch {
      alert(payload);
    }
  }

  function resetLocal() {
    const ok = confirm(state.lang==="he" ? "לאפס את הנתונים המקומיים?" : "Сбросить локальные данные?");
    if (!ok) return;
    localStorage.removeItem(LS_KEY);
    localStorage.removeItem(NEWS_LS_KEY);
    toast(t("resetDone"));
    location.reload();
  }

  // ---------------------------
  // Home
  // ---------------------------
  function nowGreeting() {
    const h = new Date().getHours();
    if (h >= 5 && h < 12) return t("greetingMorning");
    if (h >= 12 && h < 18) return t("greetingDay");
    if (h >= 18 && h < 22) return t("greetingEvening");
    return t("greetingNight");
  }

  function renderHome() {
    if ($("#brandSubtitle")) $("#brandSubtitle").textContent = t("brandSubtitle");
    if ($("#homeLead")) $("#homeLead").textContent = t("homeLead");
    if ($("#homeSectionTitle")) $("#homeSectionTitle").textContent = t("homeSectionTitle");
    if ($("#newsBlockTitle")) $("#newsBlockTitle").textContent = t("newsBlockTitle");
    if ($("#newsBlockSubtitle")) $("#newsBlockSubtitle").textContent = t("newsBlockSubtitle");
    if ($("#newsSearch")) $("#newsSearch").setAttribute("placeholder", t("newsSearch"));
    if ($("#newsRefreshBtn")) $("#newsRefreshBtn").textContent = t("newsRefresh");

    if ($("#greeting")) $("#greeting").textContent = nowGreeting();

    const fromTg = tg ? (tg.initDataUnsafe?.user?.first_name || tg.initDataUnsafe?.user?.username) : null;
    const name = state.profile.name || fromTg || (state.lang === "he" ? "מאסטר" : "мастер");
    if ($("#username")) $("#username").textContent = name;

    if ($("#homeOpenCourses")) $("#homeOpenCourses").textContent = t("openCourses");
    if ($("#homeOpenWiki")) $("#homeOpenWiki").textContent = t("openWiki");

    const ownedCount = DATA.courses.filter(c => isOwned(c.id)).length;
    const paidCount = DATA.courses.filter(c => c.price > 0).length;
    const statsEl = $("#homeStats");
    if (statsEl) {
      const a = state.lang==="he" ? "קורסים זמינים" : "Доступных курсов";
      const b = state.lang==="he" ? "קורסים בתשלום" : "Платных курсов";
      const c = state.lang==="he" ? "תכנים בויקי" : "Статей в вики";
      statsEl.innerHTML = `
        <div class="stat"><div class="stat__label">${escapeHtml(a)}</div><div class="stat__value">${ownedCount}</div></div>
        <div class="stat"><div class="stat__label">${escapeHtml(b)}</div><div class="stat__value">${paidCount}</div></div>
        <div class="stat"><div class="stat__label">${escapeHtml(c)}</div><div class="stat__value">${DATA.wiki.length}</div></div>
      `;
    }

    const rec = DATA.courses.slice(0, 3);
    const recRoot = $("#homeRecommended");
    if (recRoot) {
      recRoot.innerHTML = rec.map(courseCardHTML).join("");
      $$("#homeRecommended .card").forEach(card => {
        card.addEventListener("click", () => openCourse(card.dataset.id));
      });
    }

    const cached = loadNewsCache();
    renderNews(cached.items);

    const tooOld = (Date.now() - (cached.at || 0)) > (6 * 60 * 60 * 1000);
    if (!cached.items?.length || tooOld) refreshNews({ silent: true });
  }

  // ---------------------------
  // i18n apply for navigation + headers
  // ---------------------------
  function applyI18n() {
    if ($("#navHome")) $("#navHome").textContent = t("navHome");
    if ($("#navCourses")) $("#navCourses").textContent = t("navCourses");
    if ($("#navSupport")) $("#navSupport").textContent = t("navSupport");
    if ($("#navWiki")) $("#navWiki").textContent = t("navWiki");

    if ($("#coursesTitle")) $("#coursesTitle").textContent = t("coursesTitle");
    if ($("#coursesSearch")) $("#coursesSearch").setAttribute("placeholder", t("coursesSearch"));
    const f = $("#coursesFilter");
    if (f && f.options?.length >= 4) {
      f.options[0].text = t("filterAll");
      f.options[1].text = t("filterFree");
      f.options[2].text = t("filterPaid");
      f.options[3].text = t("filterOwned");
    }

    if ($("#wikiTitle")) $("#wikiTitle").textContent = t("wikiTitle");
    if ($("#wikiSearch")) $("#wikiSearch").setAttribute("placeholder", t("wikiSearch"));

    if ($("#backToCourses")) $("#backToCourses").textContent = t("back");
    if ($("#backToCourse")) $("#backToCourse").textContent = t("back");
    if ($("#backFromProfile")) $("#backFromProfile").textContent = t("back");

    // support placeholders (keep RU placeholder if user didn't type yet)
    if ($("#supportSendBtn")) $("#supportSendBtn").textContent = (state.lang==="he" ? "שלח" : "Отправить");
    if ($("#supportCopyBtn")) $("#supportCopyBtn").textContent = (state.lang==="he" ? "העתק" : "Скопировать");
    if ($("#supportTopic") && !$("#supportTopic").value) $("#supportTopic").setAttribute("placeholder", state.lang==="he" ? "נושא" : "Тема");
  }

  // ---------------------------
  // Render all
  // ---------------------------
  function renderAll() {
    renderHome();
    renderCourses();
    buildWikiCategories();
    renderWiki();
    renderSupport();
    if (current.tab === "course" && current.courseId) renderCourse(current.courseId);
    if (current.tab === "lesson" && current.courseId && current.lessonId) renderLesson(current.courseId, current.lessonId);
    if (current.tab === "profile") renderProfile();
  }

  // ---------------------------
  // Events
  // ---------------------------
  function bindEvents() {
    navItems.forEach(btn => {
      btn.addEventListener("click", () => {
        const tab = btn.dataset.tab;
        showScreen(tab);
        current.returnTab = tab;
        renderAll();
      });
    });

    $("#closeBtn")?.addEventListener("click", () => { if (tg) safe(() => tg.close()); });

    $("#langToggle")?.addEventListener("click", () => {
      setLang(state.lang === "ru" ? "he" : "ru");
      $("#langToggle").textContent = (state.lang === "he") ? "HE" : "RU";
    });

    $("#profileBtn")?.addEventListener("click", () => {
      current.returnTab = current.tab;
      showScreen("profile");
      renderProfile();
    });

    $("#homeOpenCourses")?.addEventListener("click", () => {
      showScreen("courses");
      current.returnTab = "courses";
      renderAll();
    });

    $("#homeOpenWiki")?.addEventListener("click", () => {
      showScreen("wiki");
      current.returnTab = "wiki";
      renderAll();
    });

    $("#newsRefreshBtn")?.addEventListener("click", () => refreshNews({ silent: false }));
    $("#newsSearch")?.addEventListener("input", () => {
      const cached = loadNewsCache();
      renderNews(cached.items);
    });

    $("#coursesSearch")?.addEventListener("input", renderCourses);
    $("#coursesFilter")?.addEventListener("change", renderCourses);

    $("#backToCourses")?.addEventListener("click", () => {
      showScreen("courses");
      renderAll();
    });

    $("#backToCourse")?.addEventListener("click", () => {
      showScreen("course");
      renderCourse(current.courseId);
    });

    $("#backFromProfile")?.addEventListener("click", () => {
      showScreen(current.returnTab || "home");
      renderAll();
    });

    $("#wikiSearch")?.addEventListener("input", renderWiki);
    $("#wikiCategory")?.addEventListener("change", renderWiki);

    $("#supportSendBtn")?.addEventListener("click", sendSupport);
    $("#supportCopyBtn")?.addEventListener("click", copySupport);

    $("#exportData")?.addEventListener("click", exportData);
    $("#resetLocal")?.addEventListener("click", resetLocal);

    $("#brandTap")?.addEventListener("click", () => {
      brandTapCount += 1;
      clearTimeout(brandTapTimer);
      brandTapTimer = setTimeout(() => { brandTapCount = 0; }, 1200);
      if (brandTapCount >= 7) {
        brandTapCount = 0;
        state.admin.unlocked = true;
        saveState();
        toast(state.lang==="he" ? "אדמין ✅" : "Админ ✅");
      }
    });
  }

  // ---------------------------
  // Boot
  // ---------------------------
  function boot() {
    if (!["ru","he"].includes(state.lang)) state.lang = "ru";
    applyLangDir();
    applyI18n();
    if ($("#langToggle")) $("#langToggle").textContent = (state.lang === "he") ? "HE" : "RU";

    showScreen("home");
    bindEvents();
    renderAll();
  }

  document.addEventListener("DOMContentLoaded", boot);
})();
