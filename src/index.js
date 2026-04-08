function displayJoke(response) {
    console.log(response.data.answer);
  
    new Typewriter("#joke", {
      strings: response.data.answer,
      autoStart: true,
      cursor: null,
      delay: 30,
    });
  }
  function clickJoke(event) {
    event.preventDefault();
    let apiKey = "a08f0oc3b4t11e51a8dbab6fef7e5923";
    let context = "You are an AI assistant that tells a short, witty and funny jokes. Your jokes are different everytime the button is clicked.";
    let prompt =
      "Generate new short, witty and funny jokes. Generate jokes one at a time. Don't repeat the jokes. Provide the answer in plain text.";
    let apiUrl = `https://api.shecodes.io/ai/v1/generate?prompt=${prompt}&context=${context}&key=${apiKey}`;
  
    let jokeElement = document.querySelector("#joke");
    jokeElement.innerHTML = "Generating a joke for you. Please wait..";
  
    console.log("called the AI api");
    axios.get(apiUrl).then(displayJoke);
  }
  
  let clickJokeButton = document.querySelector("#clickjokebutton");
  clickJokeButton.addEventListener("click", clickJoke);
 
 
  