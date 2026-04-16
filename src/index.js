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

document
  .getElementById("clickjokebutton")
  .addEventListener("click", clickJoke);

function displayJoke(response) {
  let data = response.data;

  let joke = "";

  if (data.joke) {
    joke = data.joke;
  } else {
    joke = `${data.setup} 😂 ${data.delivery}`;
  }

  // safety filter
  if (!isSafe(joke)) {
    console.log("Unsafe joke filtered — retrying...");
    clickJoke();
    return;
  }

  document.querySelector("#joke").innerHTML = "";

  new Typewriter("#joke", {
    strings: joke,
    autoStart: true,
    cursor: "✨",
    delay: 25,
  });
}

function clickJoke() {
  document.querySelector("#joke").innerHTML =
    "<div class='loader'></div>";

  const url =
    "https://v2.jokeapi.dev/joke/Any?safe-mode&type=single,twopart";

  axios
    .get(url)
    .then(displayJoke)
    .catch((error) => {
      console.log(error);
      document.querySelector("#joke").innerHTML =
        "Oops 😬 Try again!";
    });
}

// COPY BUTTON
document.getElementById("copyBtn").addEventListener("click", () => {
  let jokeText = document.querySelector("#joke").innerText;

  navigator.clipboard.writeText(jokeText).then(() => {
    alert("Copied 😂");
  });
});