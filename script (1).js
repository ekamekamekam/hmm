// ---------- config ----------
const MILESTONES = [1, 5, 10, 25, 50, 100, 250, 500];

const MESSAGES = [
  { at: 0,   text: "go on... you know you want to" },
  { at: 1,   text: "one kissy for you! 💋" },
  { at: 2,   text: "aww, another one already?" },
  { at: 3,   text: "Ekam is twiddling her toes" },
  { at: 5,   text: "ooh lala yum yum yum i rike dat one" },
  { at: 8,   text: "gawk gawk gawk" },
  { at: 10,  text: "double digits?! licky licky" },
  { at: 15,  text: "shake it shake it" },
  { at: 20,  text: "spin it 360" },
  { at: 25,  text: "quarter-century club, I ROVE dis one" },
  { at: 35,  text: "Ekam will eat you" },
  { at: 50,  text: "50?! what the heckle im getting wetty" },
  { at: 75,  text: "Ekam is licking you up" },
  { at: 100, text: "100 KISSIES?! Ekam is eating you" },
  { at: 150, text: "gawk gawk gawk gawk gawk" },
  { at: 200, text: "scientists are studying your click finger" },
  { at: 300, text: "you have officially broken the kissy-meter" },
  { at: 500, text: "500?! marry the button already" },
];

const HEART_EMOJIS = ["💕", "💖", "💗", "💓", "💞", "💘"];
const KISS_EMOJIS = ["💋", "💕", "💖", "😘"];
const CONFETTI_COLORS = ["#ff6fa5", "#ffd6a8", "#d9c8ff", "#ffb8d9", "#fff8f3"];

// ---------- state ----------
let count = 0;

// ---------- elements ----------
const kissButton = document.getElementById("kissButton");
const countNumber = document.getElementById("countNumber");
const countLabel = document.getElementById("countLabel");
const messageEl = document.getElementById("message");
const counterCard = document.getElementById("counterCard");
const milestoneTrack = document.getElementById("milestoneTrack");
const confettiLayer = document.getElementById("confettiLayer");
const bgHearts = document.getElementById("bgHearts");
const sparkleLayer = document.getElementById("sparkleLayer");
const stage = document.querySelector(".stage");

// ---------- build milestone dots ----------
MILESTONES.forEach((m) => {
  const dot = document.createElement("div");
  dot.className = "milestone-dot";
  dot.dataset.value = m;
  dot.setAttribute("data-label", m);
  milestoneTrack.appendChild(dot);
});

function updateMilestoneDots() {
  document.querySelectorAll(".milestone-dot").forEach((dot) => {
    const value = Number(dot.dataset.value);
    dot.classList.toggle("done", count >= value);
  });
}

// ---------- message logic ----------
function getMessageFor(n) {
  let current = MESSAGES[0].text;
  for (const m of MESSAGES) {
    if (n >= m.at) current = m.text;
  }
  return current;
}

function setMessage(text) {
  messageEl.textContent = text;
  messageEl.classList.remove("change");
  // force reflow to restart animation
  void messageEl.offsetWidth;
  messageEl.classList.add("change");
}

// ---------- label logic ----------
function updateLabel() {
  countLabel.textContent = count === 1 ? "kissy collected" : "kissies collected";
}

// ---------- particle burst ----------
function spawnParticles(x, y) {
  const numParticles = 6 + Math.floor(Math.random() * 4);
  for (let i = 0; i < numParticles; i++) {
    const el = document.createElement("span");
    el.className = "kiss-particle";
    el.textContent = Math.random() < 0.5
      ? KISS_EMOJIS[Math.floor(Math.random() * KISS_EMOJIS.length)]
      : HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)];

    const angle = (Math.random() * Math.PI) + Math.PI; // upward-ish spread
    const distance = 60 + Math.random() * 90;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance - 40;
    const rot = (Math.random() * 60 - 30) + "deg";

    el.style.left = x + "px";
    el.style.top = y + "px";
    el.style.setProperty("--tx", tx + "px");
    el.style.setProperty("--ty", ty + "px");
    el.style.setProperty("--rot", rot);
    el.style.fontSize = (1 + Math.random() * 0.8) + "rem";

    document.body.appendChild(el);
    el.addEventListener("animationend", () => el.remove());
  }
}

// ---------- confetti burst ----------
function spawnConfetti() {
  const count = 60;
  for (let i = 0; i < count; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti-piece";
    const size = 6 + Math.random() * 6;
    piece.style.width = size + "px";
    piece.style.height = size * 0.4 + "px";
    piece.style.left = Math.random() * 100 + "vw";
    piece.style.background = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    piece.style.animationDuration = (2.2 + Math.random() * 1.6) + "s";
    piece.style.animationDelay = (Math.random() * 0.4) + "s";
    confettiLayer.appendChild(piece);
    piece.addEventListener("animationend", () => piece.remove());
  }
}

// ---------- ambient floating hearts ----------
function spawnBgHeart() {
  const heart = document.createElement("span");
  heart.className = "bg-heart";
  heart.textContent = HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)];
  heart.style.left = Math.random() * 100 + "vw";
  heart.style.setProperty("--drift", (Math.random() * 80 - 40) + "px");
  heart.style.animationDuration = (8 + Math.random() * 8) + "s";
  heart.style.fontSize = (1 + Math.random() * 1.3) + "rem";
  bgHearts.appendChild(heart);
  heart.addEventListener("animationend", () => heart.remove());
}
setInterval(spawnBgHeart, 900);
for (let i = 0; i < 6; i++) setTimeout(spawnBgHeart, i * 300);

// ---------- ambient sparkles ----------
function spawnSparkle() {
  const s = document.createElement("span");
  s.className = "sparkle";
  s.style.left = Math.random() * 100 + "vw";
  s.style.top = Math.random() * 100 + "vh";
  s.style.animationDelay = (Math.random() * 1.5) + "s";
  sparkleLayer.appendChild(s);
  setTimeout(() => s.remove(), 2600);
}
setInterval(spawnSparkle, 700);

// ---------- click handler ----------
kissButton.addEventListener("click", (e) => {
  count++;
  countNumber.textContent = count;
  updateLabel();
  updateMilestoneDots();

  const text = getMessageFor(count);
  setMessage(text);

  // button feedback
  kissButton.classList.remove("tapped", "ripple");
  void kissButton.offsetWidth;
  kissButton.classList.add("tapped", "ripple");

  // card pulse
  counterCard.classList.remove("pulse");
  void counterCard.offsetWidth;
  counterCard.classList.add("pulse");
  setTimeout(() => counterCard.classList.remove("pulse"), 180);

  // particles from click point (or button center on keyboard activation)
  const rect = kissButton.getBoundingClientRect();
  const x = e.clientX || (rect.left + rect.width / 2);
  const y = e.clientY || (rect.top + rect.height / 2);
  spawnParticles(x, y);

  // milestone celebration
  if (MILESTONES.includes(count)) {
    spawnConfetti();
    stage.classList.remove("shake");
    void stage.offsetWidth;
    stage.classList.add("shake");
  }
});
