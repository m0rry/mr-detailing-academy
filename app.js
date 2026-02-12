// --- Telegram WebApp bootstrap ---
const tg = window.Telegram?.WebApp;

function safeSet(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

if (tg) {
  tg.ready();
  tg.expand();

  // Optional: make app colors match
  try { tg.setHeaderColor?.("#0b0d12"); } catch(e){}
  try { tg.setBackgroundColor?.("#0b0d12"); } catch(e){}

  const user = tg.initDataUnsafe?.user;
  if (user) {
    safeSet("username", user.first_name || "User");
    // greeting
    const h = new Date().getHours();
    const greet = h < 12 ? "Доброе утро," : (h < 18 ? "Добрый день," : "Добрый вечер,");
    safeSet("greeting", greet);
  }

  // Close button in top-left
  const closeBtn = document.getElementById("closeBtn");
  if (closeBtn) closeBtn.addEventListener("click", () => tg.close());
} else {
  // If opened in browser
  const h = new Date().getHours();
  const greet = h < 12 ? "Доброе утро," : (h < 18 ? "Добрый день," : "Добрый вечер,");
  safeSet("greeting", greet);
}

// --- Premium parallax (touch + mouse) ---
const cards = Array.from(document.querySelectorAll("[data-parallax]"));
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

function applyParallax(el, nx, ny) {
  const layers = el.querySelectorAll(".layer");
  layers.forEach((layer, i) => {
    const depth = (i + 1) * 10;           // stronger depth like crypto apps
    const x = nx * depth;
    const y = ny * depth;
    layer.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  });
}

function resetParallax(el) {
  el.querySelectorAll(".layer").forEach(layer => {
    layer.style.transform = "translate3d(0,0,0)";
  });
}

cards.forEach(el => {
  // Mouse
  el.addEventListener("mousemove", (e) => {
    const r = el.getBoundingClientRect();
    const nx = clamp(((e.clientX - r.left) / r.width - 0.5) * 2, -1, 1);
    const ny = clamp(((e.clientY - r.top) / r.height - 0.5) * 2, -1, 1);
    applyParallax(el, nx, ny);
  });

  el.addEventListener("mouseleave", () => resetParallax(el));

  // Touch (drag)
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

// --- Bottom nav UX (active state only for now) ---
document.querySelectorAll(".nav__item").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".nav__item").forEach(b => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    // Later we will switch screens. Сейчас только эффект как в приложении.
  });
});

// --- Buttons (stub actions) ---
const toast = (msg) => {
  if (tg?.showPopup) {
    tg.showPopup({ title: "MR Academy", message: msg, buttons: [{type:"ok"}] });
  } else {
    alert(msg);
  }
};

document.getElementById("openWash")?.addEventListener("click", () => toast("Откроем уроки мойки на следующем шаге."));
document.getElementById("previewWash")?.addEventListener("click", () => toast("Сделаем превью уроков и тестов."));
document.getElementById("buyInterior")?.addEventListener("click", () => toast("Дальше подключим оплату Telegram Stars (invoice через бота)."));
document.getElementById("refInterior")?.addEventListener("click", () => toast("Дальше подключим рефералку: 3 друга = -50%."));
document.getElementById("notifyPolish")?.addEventListener("click", () => toast("Сделаем подписку на уведомление о релизе."));
document.getElementById("notifyProtect")?.addEventListener("click", () => toast("Сделаем подписку на уведомление о релизе."));
