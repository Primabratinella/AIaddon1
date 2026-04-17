let voiceEnabled = true;
let isTyping = false;

const offlineJokes = [
  "Why don’t eggs tell jokes? They’d crack each other up 😂",
  "I told my computer I needed a break… it said no problem 😅",
  "Why did the math book look sad? Too many problems 📚"
];
function isSafe(joke) {
  const bannedWords = [
    "stupid",
    "hate",
    "kill",
    "drunk",
    "beer",
    "sex",
    "gun"
  ];

  return !bannedWords.some(word =>
    joke.toLowerCase().includes(word)
  );
}

/* =========================
   MEMORY (NO REPEATS)
========================= */
let jokeHistory =
  JSON.parse(localStorage.getItem("jokeHistory")) || [];

let favorites =
  JSON.parse(localStorage.getItem("favorites")) || [];

/* =========================
   ELEMENTS
========================= */
const button = document.getElementById("clickjokebutton");
const copyBtn = document.getElementById("copyBtn");
const chatbox = document.getElementById("chatbox");
const sound = document.getElementById("laugh-sound");
const favBtn = document.getElementById("favBtn");

/* =========================
   EVENT LISTENERS (SAFE)
========================= */
if (button) button.addEventListener("click", clickJoke);

if (copyBtn) {
  copyBtn.addEventListener("click", () => {
    const jokes = document.querySelectorAll(".message.bot");
    if (!jokes.length) return;

    const lastJoke = jokes[jokes.length - 1].innerText;
    navigator.clipboard.writeText(lastJoke);
  });
}

if (favBtn) {
  favBtn.addEventListener("click", () => {
    const jokes = document.querySelectorAll(".message.bot");
    if (!jokes.length) return;

    const lastJoke = jokes[jokes.length - 1].innerText;

    if (!favorites.includes(lastJoke)) {
      favorites.push(lastJoke);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      alert("Saved ⭐");
    }
  });
}

const voiceToggle = document.getElementById("voiceToggle");

if (voiceToggle) {
  voiceToggle.addEventListener("click", () => {
    voiceEnabled = !voiceEnabled;

    voiceToggle.textContent = voiceEnabled
      ? "🔊 Voice: ON"
      : "🔇 Voice: OFF";

    // stop any current speech immediately
    if (!voiceEnabled) {
      window.speechSynthesis.cancel();
    }
  });
}
/* =========================
   CHAT MESSAGE FUNCTION
========================= */
function addMessage(text, type = "bot") {
  const msg = document.createElement("div");
  msg.classList.add("message", type);

  // better formatting for chat feel
  msg.innerHTML = `
    <div class="bubble">${text}</div>
  `;

  chatbox.appendChild(msg);

  if (navigator.vibrate) {
    navigator.vibrate(20);
  }

  setTimeout(() => {
    scrollToBottom();
  }, 50);

  return msg;
}

/* =========================
   TYPING ANIMATION
========================= */
function showTyping() {
  const msg = document.createElement("div");
  msg.classList.add("message", "bot");

  msg.innerHTML = `
    <div class="bubble typing-bubble">
      <span></span>
      <span></span>
      <span></span>
    </div>
  `;

  chatbox.appendChild(msg);
  scrollToBottom();

  return msg;
}

/* =========================
   MAIN FUNCTION (AI JOKES)
========================= */
function scrollToBottom() {
  chatbox.scrollTo({
    top: chatbox.scrollHeight,
    behavior: "smooth"
  });
}
async function clickJoke() {

  if (isTyping) return;
  isTyping = true;

  let retries = 0;

  const typingMsg = showTyping();

  const kidMode = document.getElementById("kidMode")?.checked;

  const prompt = kidMode
    ? "Tell a clean, funny, kid-safe joke suitable for families."
    : "Tell a funny clean joke.";

  try {
    let joke = await fetchAIJoke(prompt);

    typingMsg.remove();

    joke = joke.trim();

    if (!isSafe(joke) || jokeHistory.includes(joke)) {
      if (retries < 3) {
        retries++;
        return clickJokeRetry();
      }
      
      retries = 0;
      addMessage("Couldn't find a good joke 😅 Try again", "bot");
      return;
    }

    retries = 0;

    jokeHistory.push(joke);
    jokeHistory = jokeHistory.slice(-30);
    localStorage.setItem("jokeHistory", JSON.stringify(jokeHistory));

    addMessage(joke, "bot");

    if (sound) sound.play().catch(() => {});
    if (voiceEnabled) {
      speakJoke(joke);
      isTyping = false;
    }

  } catch (err) {
    isTyping = false;
    typingMsg.remove();

    const fallback =
      offlineJokes[Math.floor(Math.random() * offlineJokes.length)];

    addMessage(fallback, "bot");
  }
}

/* =========================
   SAFE RETRY (PREVENT LOOP CRASH)
========================= */
function clickJokeRetry() {
  isTyping = false;
  setTimeout(() => clickJoke(), 300);
}

/* =========================
   TEXT TO SPEECH
========================= */
function speakJoke(text) {
  const speech = new SpeechSynthesisUtterance(
    text.replace("😂", "... 😂")
  );

  speech.lang = "en-US";
  speech.rate = 0.85;
  speech.pitch = 1;

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(speech);
}

/* =========================
   AI API
========================= */
async function fetchAIJoke(prompt) {
  const apiKey = "a08f0oc3b4t11e51a8dbab6fef7e5923";

  const response = await axios.get(
    "https://api.shecodes.io/ai/v1/generate",
    {
      params: {
        prompt,
        context: "You are a funny, clean, kid-safe comedian.",
        key: apiKey
      }
    }
  );
  return response.data.answer;
}

/* =========================
   SERVICE WORKER (PWA READY)
========================= */
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}


let deferredPrompt;

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;

  const btn = document.createElement("button");
  btn.innerText = "⬇ Install App";
  btn.style.position = "fixed";
  btn.style.bottom = "90px";
  btn.style.right = "16px";
  btn.style.zIndex = "9999";
  btn.style.padding = "10px 14px";
  btn.style.borderRadius = "12px";
  btn.style.border = "none";
  btn.style.background = "#3b82f6";
  btn.style.color = "white";

  document.body.appendChild(btn);

  btn.onclick = async () => {
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    deferredPrompt = null;
    btn.remove();
  };
});

const historyBtn = document.getElementById("historyBtn");
const historyModal = document.getElementById("historyModal");
const historyList = document.getElementById("historyList");
const closeHistory = document.getElementById("closeHistory");
const clearHistory = document.getElementById("clearHistory");

function renderHistory() {
  historyList.innerHTML = "";

  if (jokeHistory.length === 0) {
    historyList.innerHTML = "<p>No jokes yet 😅</p>";
    return;
  }

  jokeHistory.slice().reverse().forEach(joke => {
    const div = document.createElement("div");
    div.classList.add("message", "bot");
    div.textContent = joke;
    historyList.appendChild(div);
  });
}

if (historyBtn) {
  historyBtn.addEventListener("click", () => {
    renderHistory();
    historyModal.classList.remove("hidden");
  });
}

if (closeHistory) {
  closeHistory.addEventListener("click", () => {
    historyModal.classList.add("hidden");
  });
}

if (clearHistory) {
  clearHistory.addEventListener("click", () => {
    jokeHistory = [];
    localStorage.removeItem("jokeHistory");
    renderHistory();
  });
}

