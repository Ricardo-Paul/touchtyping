const textDisplay = document.querySelector("#text-display");

let randomWords = [];
const defaultLanguage = "english"

function setLanguage(_language = defaultLanguage){
  fetch("data/words.json")
  .then(response => response.json())
  .then(json => {
    randomWords = json[_language].split(" ");
    console.log("WORDS :", randomWords);
  })
}

setLanguage();