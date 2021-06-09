
const textDisplay = document.querySelector("#text-display");
const inputField = document.querySelector("#input-field");

let wordBaseDisplay = document.querySelector("#word-count");
let timeBaseDisplay = document.querySelector("#time-count");

const cookies = {
  language: "LANGUAGE",
  wordCount: "WORDCOUNT",
  typingMode: "TYPING_MODE",
  expireAfter: 5
};

let randomWords = [];
let wordList = []; //displayed words
const defaultLanguage = "english";
const defaultWordCount = 25;
let typingMode = getCookie("typingMode") || "wordCountBase";
let timeCount = getCookie("timeCount") || 60;
let wordCount = getCookie(cookies.wordCount) || 25;

let currentWord = 0;
let correctKeys = 0;
let startDate;
let timer;

function redo(){
  // alert("redo is pressed")
  fillWordList();
}

function setTypingMode(mode){
  setCookie('typingMode', mode, 90);

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

// fucntion called from index html
function setWordCount(_wordCount){
  inputField.value = "";
  wordCount = _wordCount;
  // alert( timeCount);
  setCookie(cookies.wordCount, _wordCount, 90);
  let nodes = document.querySelectorAll("#word-count > span");
  let arr = [...nodes];

  function resetElStyle(){
    arr.forEach(el => {
      el.style.borderBottom = "";
      el.style.fontWeight = "400"
      el.innerHTML = el.id.slice(-2);
      if(el.id.length > 5) el.innerHTML = el.id.slice(-3);
    });
  };

  resetElStyle();

  arr.filter(el => el.id === `wc-${_wordCount}`)[0].style.borderBottom = "2px solid";
  fillWordList();
};

// function called from index.html
function setTimeCount(_timeCount){
  inputField.value = "";
  clearTimeout(timer);
  timeCount =_timeCount //affect the timecount var
  // alert( timeCount);
  setCookie("timeCount", timeCount, 90);
  let nodes = document.querySelectorAll("#time-count > span");
  let arr = [...nodes]; //convert the node list into an array
  resetElStyle();

  function resetElStyle(){
    arr.forEach(el => {
      el.style.borderBottom = "";
      el.style.fontWeight = "400"
      el.innerHTML = el.id.slice(-2);
      if(el.id.length > 5) el.innerHTML = el.id.slice(-3);
    });
  };

  arr.filter(el => el.id === `tc-${timeCount}`)[0].style.borderBottom = "2px solid";
  arr.filter(el => el.id === `tc-${timeCount}`)[0].style.fontWeight = "600";
  fillWordList();
};

function fillWordList(_wordCount = defaultWordCount){
  // decide whether to empty the wordlist when shift is pressed
  inputField.value = "";
  wordList = [];
  currentWord = 0;
  let wordCount = getCookie(cookies.wordCount) || _wordCount;
  setCookie(cookies.wordCount, wordCount, cookies.expireAfter);
  // alert(wordCount);
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

          // produce a scroll effect when reaching the end of the first line
          if(typingMode === "timeBase"){
            let currentWordPosition = textDisplay.childNodes[currentWord].getBoundingClientRect();
            let nextWordPosition = textDisplay.childNodes[currentWord + 1].getBoundingClientRect();
            if (currentWordPosition.top < nextWordPosition.top){
              // alert("Skip the line")
              for(i=0; i < currentWord; i++){
                textDisplay.childNodes[i].style.display = "none"
              }
            }
          }

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
      break;
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
            textDisplay.innerHTML = "Time out";
            inputField.value = "";
            showResult();
          }
        }
      }
    }
  }
});

function showResult(){
  textDisplay.innerHTML = "";
  const resultSpace = document.querySelector("#right-wing");
  let words, minute, acc, wpm, totalKeys = 0;
  words = correctKeys / 5;
  wordList.forEach(w => totalKeys += w.length);

  switch(typingMode){
    case "wordCountBase":{
      minute = (Date.now() - startDate) / 1000 / 60;
      acc = Math.floor((correctKeys / totalKeys) * 100);
    }
    break;
    case "timeBase": {
      minute = timeCount / 60 //timecount in secs / 60
      let typedKeys =0;
      for(i=0; i < currentWord; i++){
        typedKeys += wordList[currentWord].length;
      };
      
      acc = Math.min(Math.floor((correctKeys / typedKeys) * 100), 100);
    }
  }
  wpm = Math.floor(words / minute);
  resultSpace.innerHTML = `WPM: ${wpm} ACC: ${acc}`;
  inputField.classList.remove("wrong");

  console.log("WPM", words, minute, "acc:", acc );
  console.log('result is ready');
  console.log("KT", totalKeys, "CK", correctKeys)
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
  let c = document.cookie;

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

document.onload = (function(){
  setTypingMode(typingMode);
  if(typingMode === "timeBase"){
    document.querySelector(`#tc-${timeCount}`).style.borderBottom = "2px solid";
  }
})();