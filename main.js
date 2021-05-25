const textDisplay = document.querySelector("#text-display");

let randomWords = [];
const defaultLanguage = "english"

// check whether the user has chosen a language


function setLanguage(_language = defaultLanguage){
  fetch("data/words.json")
  .then(response => response.json())
  .then(json => {

    // deice what language to set based on cookie
    // if language not set, set english as the default language for the user
    randomWords = json[_language].split(" ");
    console.log("WORDS :", randomWords);
  });
};

setLanguage();


// set cookie along with an expiry date
function setCookie(cname, cvalue, exdays){
  let d = new Date();
  d.setTime(d.getTime() + 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + exdays + expires + ";" + "path=/"
};