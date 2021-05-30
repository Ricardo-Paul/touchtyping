const textDisplay = document.querySelector("#text-display");
const inputField = document.querySelector("#input-field");

let wordBaseDisplay = document.querySelector("#word-count");
let timeBaseDisplay = document.querySelector("#time-count");


let randomWords = [];
let wordList = []; //displayed words
const defaultLanguage = "english";
const defaultWordCount = 25;
let typingMode = getCookie("typingMode") || "wordCountBase";
let timeCount = getCookie("timeCount") || 60;


let currentWord = 0;
let correctKeys = 0;
let startDate;
let timer;

const cookies = {
  language: "LANGUAGE",
  wordCount: "WORDCOUNT",
  typingMode: "TYPING_MODE",
  expireAfter: 5
};



console.log("TM:::",typingMode);
setTypingMode(typingMode)

function setTypingMode(mode){
  console.log("MODE", mode)
  setCookie('typingMode', mode, 90);
    console.log(wordBaseDisplay, timeBaseDisplay);
    switch(typingMode){
      case "wordCountBase":{
        wordBaseDisplay.style.display = "block";
        timeBaseDisplay.style.display = "none";
      }
      break;
      case "timeBase": {
        wordBaseDisplay.style.display = "none";
        timeBaseDisplay.style.display = "block";
      }
    }
};

// function called from index.html
function setTimeCount(_timeCount){
  clearTimeout(timer);
  timeCount =_timeCount //affect the timecount var
  // alert( timeCount);
  setCookie("timeCount", timeCount, 90);
  let nodes = document.querySelectorAll("#time-count > span");
  let arr = [...nodes];
  setTimerHtml();

  function setTimerHtml(){
    arr.forEach(el => {
      el.style.borderBottom = "";
      el.innerHTML = el.id.slice(-2);
      if(el.id.length > 5) el.innerHTML = el.id.slice(-3);
    });
  };

  arr.filter(el => el.id === `tc-${timeCount}`)[0].style.borderBottom = "2px solid";
  fillWordList();
};

function fillWordList(_wordCount = defaultWordCount){
  // decide whether to empty the wordlist when shift is pressed

  wordList = [];
  currentWord = 0;
  let wordCount = getCookie(cookies.wordCount) || _wordCount;
  setCookie(cookies.wordCount, wordCount, cookies.expireAfter);
  switch(typingMode){
    case "wordCountBase":{
      for(i=0; i < wordCount; i++ ){
        let random = Math.floor(Math.random() * randomWords.length);
          wordList.push(randomWords[random].trim());
      };
    }
    break;
    case "timeBase": {
      textDisplay.style.height = "2.2rem";
      textDisplay.style.fontSize = "1.2rem";
      for(let i=0; i < 500; i++){
        let random = Math.floor(Math.random() * randomWords.length);
        wordList.push(randomWords[random].trim());
      }
    }
  }

  showText();
  console.log(wordList);
};

function showText(){
  textDisplay.innerHTML = "";
  // currentWord = 0;
  // alert("executed")

  inputField.focus();
  wordList.forEach(word => {
    let span = document.createElement("span");
    span.innerHTML = word + " ";
    textDisplay.appendChild(span);
  });
  textDisplay.firstChild.classList.add("highlight");
}

inputField.addEventListener("keydown", (e) => {
  if(currentWord < wordList.length){
    checkSpelling();
    function checkSpelling(){
      // the characters we take as value along with the alpha
      const specialChars = [".", ",", ";", "\"", "\'"];
      const isAlpha = e.key >= "a" && e.key <= "z";

      if(isAlpha || specialChars.includes(e.key)){
        let currentInput = inputField.value + e.key;
        let currentWordSlice = wordList[currentWord];
        console.log("CI:", currentInput, "CWS:", currentWordSlice);
        console.log(currentWordSlice.indexOf(currentInput.trim()));

        if(currentWordSlice.indexOf(currentInput.trim()) == -1){
          inputField.classList.add("wrong");
        } else {
          inputField.classList.remove("wrong");
        };
      };

      if(e.key === "Backspace"){
        let currentInput = inputField.value.slice(0, inputField.value.length - 1);

        let currentWordSlice = wordList[currentWord]
        console.log("CI:", currentInput, "CWS:", currentWordSlice);
        console.log(currentWordSlice.indexOf(currentInput.trim()));

        if(currentWordSlice.indexOf(currentInput.trim()) == -1){
          inputField.classList.add("wrong");
        } else {
          inputField.classList.remove("wrong");
        };
      }

      if(e.key === " "){
        if(inputField.value.trim() !== ""){
            console.log("FIELD VALUE:", inputField.value, "CW:", wordList[currentWord]);
            let fieldValue = inputField.value;
            if(fieldValue.trim() === wordList[currentWord]){
              console.log("RIGHT WORD");
              textDisplay.childNodes[currentWord].classList.add("correct");
              console.log("CURRENT WORD NODE: ",textDisplay.childNodes[currentWord]);

              // only correct keys from current words are counted
              correctKeys += wordList[currentWord].length;
              console.log("CK:", correctKeys);
            } else {
              textDisplay.childNodes[currentWord].classList.add("incorrect");
            }

            currentWord < wordList.length -1  && textDisplay.childNodes[currentWord + 1].classList.add("highlight");
          currentWord < wordList.length &&  currentWord++;

          console.log("CURRENT WORD NO::", currentWord)
          console.log("LIST LENGTH::", wordList.length)
          if(currentWord === wordList.length){
            inputField.value = "";
            showResult();
          };
        };
        inputField.value = "";
      }
    }
  }

  const isFirstCharacter = inputField.value === "" && currentWord === 0;
  if(isFirstCharacter){
    switch(typingMode){
      case "wordCountBase":{
        startDate = Date.now();
        setCookie("typingMode", "wordCountBase", 90);
      }
      case "timeBase":{
        startTimer(getCookie("timeCount") || 60);
        setCookie("typingMode", "timeBase", 90);

        function startTimer(seconds){
          if(seconds > 0){
            timer = setTimeout(() => {
              seconds--;
              startTimer(seconds);
              document.querySelector(`#tc-${timeCount}`).innerHTML = seconds;
              console.log("SECONDS", seconds)
            }, 1000)
          } else {
            clearTimeout(timer);
            textDisplay.innerHTML = "";
            inputField.value = "";
          }
        }
      }
    }
  }
});

function showResult(){
  const resultSpace = document.querySelector("#right-wing");
  let words, minute, acc, wpm, totalKeys = 0;
  switch(typingMode){
    case "wordCountBase":{
      words = correctKeys / 5;
      minute = (Date.now() - startDate) / 1000 / 60;
      wpm = Math.floor(words / minute);
      wordList.forEach(w => totalKeys += w.length);
      acc = Math.floor((correctKeys / totalKeys) * 100);


      resultSpace.innerHTML = `WPM: ${wpm} ACC: ${acc}`;
      console.log("WPM", words, minute, "acc:", acc );
    }
  }

  console.log('result is ready');
}

function setLanguage(_language = defaultLanguage){
  textDisplay.innerHTML = "Loading text..."
  fetch("data/words.json")
  .then(response => response.json())
  .then(json => {
    if(json[_language] === undefined){
      console.log(`We currently don't support ${_language}`);
    };
    randomWords = json[_language].split(" ");
    setCookie(cookies.language, _language, cookies.expireAfter);
    fillWordList();
    // console.log(randomWords);
  });
};

setLanguage("english"); // start the program


// set cookie along with an expiry date
function setCookie(cname, cvalue, exdays){
  let d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";" + "path=/"
};

function getCookie(cname){

  // Renovie the cookie string
  let c = document.cookie || "timeCount=60; typingMode=wordcount; punctuation=false; _ga=GA1.2.212430062.1621050011; theme=moderndolch; wordCount=25; _gid=GA1.2.2029559042.1621902074; language=english; _gat_gtag_UA_126815322_3=1"

  let cookies = decodeURIComponent(c);
  let ca = cookies.split(";");
  for(i=0; i < ca.length; i++){
    let el = ca[i].trim();
    if(el.indexOf(cname) == 0){
      let r =  el.substring(cname.length + 1);
      console.log(r);
      return r;
    }
  };
};
