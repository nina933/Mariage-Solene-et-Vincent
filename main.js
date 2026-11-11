/* =========================================================
   CONFIGURATION
   Collez ici l'URL de votre Web App Google Apps Script
   (voir README.md, étape 3) pour recevoir les réponses RSVP
   dans un Google Sheet.
   ========================================================= */
const RSVP_ENDPOINT = "";

const WEDDING_DATE = new Date("2027-07-03T14:00:00+02:00");

const PAGES = [
  { href: "index.html", label: "Accueil", footer: false },
  { href: "programme.html", label: "Programme" },
  { href: "lieu.html", label: "Lieu", footerLabel: "Lieu & Accès" },
  { href: "hebergement.html", label: "Où dormir" },
  { href: "infos.html", label: "Infos Pratiques" },
];

function currentPage() {
  const p = location.pathname.split("/").pop();
  return p === "" ? "index.html" : p;
}

function buildHeader() {
  const el = document.getElementById("site-header");
  if (!el) return;
  const cur = currentPage();
  const links = PAGES.map(
    (p) => `<a href="${p.href}"${p.href === cur ? ' class="active"' : ""}>${p.label}</a>`
  ).join("");
  el.className = "site-header";
  el.innerHTML = `
    <div class="header-inner">
      <a href="index.html" class="monogram" aria-label="Accueil">S<i></i>V</a>
      <button class="menu-toggle" aria-label="Menu"><i class="fa-solid fa-bars"></i></button>
      <nav class="nav">${links}<a href="rsvp.html" class="btn">Répondre à l'invitation</a></nav>
    </div>`;
  el.querySelector(".menu-toggle").addEventListener("click", () =>
    el.querySelector(".nav").classList.toggle("open")
  );
}

function buildFooter() {
  const el = document.getElementById("site-footer");
  if (!el) return;
  const links = PAGES.filter((p) => p.footer !== false)
    .map((p) => `<a href="${p.href}">${p.footerLabel || p.label}</a>`)
    .join("");
  el.className = "site-footer";
  el.innerHTML = `
    <div class="monogram">S<i></i>V</div>
    <p class="names">Solène &amp; Vincent</p>
    <p class="fdate">03 JUILLET 2027</p>
    <nav>${links}<a href="rsvp.html">Répondre à l'invitation</a></nav>`;
}

function startCountdown() {
  const box = document.getElementById("countdown");
  if (!box) return;
  const d = box.querySelector("[data-d]"),
    h = box.querySelector("[data-h]"),
    m = box.querySelector("[data-m]");
  const tick = () => {
    const diff = Math.max(0, WEDDING_DATE - new Date());
    d.textContent = Math.floor(diff / 864e5);
    h.textContent = Math.floor((diff / 36e5) % 24);
    m.textContent = Math.floor((diff / 6e4) % 60);
  };
  tick();
  setInterval(tick, 30000);
}

function setupRsvp() {
  const form = document.getElementById("rsvpForm");
  if (!form) return;

  // Champs conditionnels : data-show-if="nomDuChamp:Valeur"
  const conditionals = form.querySelectorAll("[data-show-if]");
  const refresh = () => {
    conditionals.forEach((el) => {
      const [name, val] = el.dataset.showIf.split(":");
      const src = form.elements[name];
      const show = src && src.value === val;
      el.classList.toggle("hidden", !show);
      el.querySelectorAll("input,select,textarea").forEach((i) => (i.disabled = !show));
    });
  };
  form.addEventListener("change", refresh);
  refresh();

  const msg = document.getElementById("formMsg");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    msg.className = "form-msg";
    if (!RSVP_ENDPOINT) {
      msg.className = "form-msg err";
      msg.textContent =
        "Le formulaire n'est pas encore relié à Google Sheets (voir README, étape 3).";
      return;
    }
    const btn = form.querySelector("button[type=submit]");
    btn.disabled = true;
    btn.textContent = "Envoi en cours…";
    try {
      const data = new URLSearchParams(new FormData(form));
      await fetch(RSVP_ENDPOINT, { method: "POST", mode: "no-cors", body: data });
      form.reset();
      refresh();
      msg.className = "form-msg ok";
      msg.textContent = "Merci ! Votre réponse a bien été enregistrée.";
    } catch (err) {
      msg.className = "form-msg err";
      msg.textContent = "Oups, l'envoi a échoué. Réessayez ou contactez-nous directement.";
    } finally {
      btn.disabled = false;
      btn.textContent = "Confirmer";
    }
  });
}

/* Image locale avec repli : si images/xxx.jpg n'existe pas encore,
   on affiche l'image d'origine. */
function setupImages() {
  document.querySelectorAll("[data-bg]").forEach((el) => {
    const [local, fallback] = el.dataset.bg.split("|");
    const img = new Image();
    img.onload = () => (el.style.backgroundImage = `url('${local}')`);
    img.onerror = () => fallback && (el.style.backgroundImage = `url('${fallback}')`);
    img.src = local;
  });
}

buildHeader();
buildFooter();
startCountdown();
setupRsvp();
setupImages();
