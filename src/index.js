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

document
  .getElementById("clickjokebutton")
  .addEventListener("click", clickJoke);

/* =========================
   CHAT MESSAGE FUNCTION
========================= */
function addMessage(text, type = "bot") {
  const chatbox = document.getElementById("chatbox");

  const msg = document.createElement("div");
  msg.classList.add("message", type);
  msg.textContent = text;

  chatbox.appendChild(msg);
  chatbox.scrollTop = chatbox.scrollHeight;

  return msg;
}

/* =========================
   TYPING DOTS
========================= */
function showTyping() {
  return addMessage("Typing...", "bot");
}

/* =========================
   MAIN FUNCTION
========================= */
function clickJoke() {
  const typingMsg = showTyping();

  let category = document.getElementById("category").value;

  if (category === "dad") {
    prompt = "Tell a clean dad joke.";
  } else if (category === "puns") {
    prompt = "Tell a clean pun joke.";
  } else {
    prompt = "Tell a clean funny joke.";
  }

  const url =
    "https://v2.jokeapi.dev/joke/Any?safe-mode&type=single,twopart";

  axios.get(url)
    .then(res => {
      typingMsg.remove();

      let data = res.data;

      let joke = data.joke
        ? data.joke
        : `${data.setup} 😂 ${data.delivery}`;

      /* =========================
         FILTER BAD JOKES
      ========================= */
      if (!isSafe(joke)) {
        clickJoke();
        return;
      }

      /* =========================
         NO REPEATS SYSTEM
      ========================= */
      if (jokeHistory.includes(joke)) {
        clickJoke();
        return;
      }

      jokeHistory.push(joke);
      localStorage.setItem("jokeHistory", JSON.stringify(jokeHistory));

      addMessage(joke, "bot");

      const sound = document.getElementById("laugh-sound");
      if (sound) {
        sound.play().catch(() => {});
}
    })
    .catch(() => {
      typingMsg.textContent = "Oops 😬 Try again";
    });
}

/* =========================
   COPY BUTTON
========================= */
document.getElementById("copyBtn").addEventListener("click", () => {
  const jokes = document.querySelectorAll(".message.bot");

  if (!jokes.length) return;

  const lastJoke = jokes[jokes.length - 1].innerText;

  navigator.clipboard.writeText(lastJoke);
});

/* =========================
   DARK MODE TOGGLE
========================= */
const themeToggle = document.getElementById("themeToggle");

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
  });
}