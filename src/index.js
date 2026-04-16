function isSafe(joke) {
  const bannedWords = [
    "stupid",
    "hate",
    "kill",
    "drunk",
    "beer",
    "sex",
    "gun",
    "shoot"
  ];

  return !bannedWords.some(word =>
    joke.toLowerCase().includes(word)
  );
}

document
  .getElementById("clickjokebutton")
  .addEventListener("click", clickJoke);

function addMessage(text, type = "bot") {
  const chatbox = document.getElementById("chatbox");

  const msg = document.createElement("div");
  msg.classList.add("message", type);
  msg.textContent = text;

  chatbox.appendChild(msg);
  chatbox.scrollTop = chatbox.scrollHeight;

  return msg;
}

function clickJoke() {
  const chatbox = document.getElementById("chatbox");

  const loadingMsg = addMessage("Typing...", "bot");

  let category = document.getElementById("category").value;

  let prompt = "";

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
      loadingMsg.remove();

      let data = res.data;

      let joke = data.joke
        ? data.joke
        : `${data.setup} 😂 ${data.delivery}`;

      if (!isSafe(joke)) {
        clickJoke();
        return;
      }

      addMessage(joke, "bot");

      document.getElementById("laugh-sound").play();
    })
    .catch(() => {
      loadingMsg.textContent = "Oops 😬 Try again";
    });
}

document.getElementById("copyBtn").addEventListener("click", () => {
  const lastMessage = document.querySelectorAll(".message.bot");
  const joke = lastMessage[lastMessage.length - 1]?.innerText;

  navigator.clipboard.writeText(joke);
});