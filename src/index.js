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
/* =========================
   CHAT MESSAGE FUNCTION
========================= */
function addMessage(text, type = "bot") {
  const msg = document.createElement("div");
  msg.classList.add("message", type);
  msg.textContent = text;

  chatbox.appendChild(msg);
  chatbox.scrollTop = chatbox.scrollHeight;

  return msg;
}

/* =========================
   TYPING ANIMATION
========================= */
function showTyping() {
  const msg = document.createElement("div");
  msg.classList.add("message", "bot");

  msg.innerHTML = `
    <div class="typing">
      <span></span>
      <span></span>
      <span></span>
    </div>
  `;

  chatbox.appendChild(msg);
  chatbox.scrollTop = chatbox.scrollHeight;

  return msg;
}

/* =========================
   MAIN FUNCTION (AI JOKES)
========================= */
async function clickJoke() {
  const typingMsg = showTyping();

  const kidMode = document.getElementById("kidMode")?.checked;

  const prompt = kidMode
    ? "Tell a clean, funny, kid-safe joke suitable for families."
    : "Tell a funny clean joke.";

  try {
    let joke = await fetchAIJoke(prompt);

    typingMsg.remove();

    joke = joke.trim();

    if (!isSafe(joke)) return clickJokeRetry();

    if (jokeHistory.includes(joke)) return clickJokeRetry();

    jokeHistory.push(joke);
    localStorage.setItem("jokeHistory", JSON.stringify(jokeHistory));

    addMessage(joke, "bot");

    if (sound) sound.play().catch(() => {});

    speakJoke(joke);

  } catch (err) {
    typingMsg.textContent = "Oops 😬 Try again";
  }
}

/* =========================
   SAFE RETRY (PREVENT LOOP CRASH)
========================= */
function clickJokeRetry() {
  setTimeout(() => 
    clickJoke(), 300);
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