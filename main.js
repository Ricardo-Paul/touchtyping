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

function getCookie(cname){
  // let cookies = decodeURIComponent(document.cookie);
  let c = "timeCount=60; typingMode=wordcount; punctuation=false; _ga=GA1.2.212430062.1621050011; theme=moderndolch; wordCount=25; _gid=GA1.2.2029559042.1621902074; language=english; _gat_gtag_UA_126815322_3=1"

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
}

getCookie("timeCount");