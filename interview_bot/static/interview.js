

const msg = new SpeechSynthesisUtterance();
let voices = [];
const voiceinator = document.querySelector('.voiceinator');
const voicesDropdown = document.querySelector('[name="voice"]');
const recordButton = document.querySelector('#record');
const askButton = document.querySelector('#ask');
const stopButton = document.querySelector('#stop');
const text_area = document.querySelector('[name="text"]');
text_area.value = '';

function populateVoices() {
  voices = this.getVoices();
  voicesDropdown.innerHTML = voices
    .filter(voice => voice.lang.includes('en'))
    .map(voice => `<option value="${voice.name}">${voice.name} (${voice.lang})</option>`)
    .join('');
}

function toggle(startOver = true) {
  speechSynthesis.cancel();
  if (startOver) {
    speechSynthesis.speak(msg);
  }
}

function setVoice() {
  msg.voice = voices.find(voice => voice.name === this.value);
  toggle();
}


function storeMSG() {
  messageInput = text_area.value;
  // console.log(messageInput);
}

function record_question(){
    recognition.addEventListener('result', e => {
      const transcript = Array.from(e.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
  
      let evt = document.createEvent("HTMLEvents");
      evt.initEvent("change", false, true);
      text_area.dispatchEvent(evt)
      console.log(transcript)
      text_area.value = transcript;
    });
    recognition.start();
}


function show(){
  // console.log(this);
  profile_pic_div.classList.remove('behind')
  voiceinator.classList.add('behind')
  display_suggested_qns()

}

function hide(){
  profile_pic_div.classList.add('behind')
  voiceinator.classList.remove('behind')
}


async function process_qn() {
console.log("this is message b4 going in", messageInput)
await fetch(`process`, {
    method: 'POST',
    body : JSON.stringify({
      "question" : messageInput,
    })
})
.then(response => {
    result = response.json()
    status_code = response.status;
    if(status_code != 200) {
        console.log('Error in getting brand info!')
        return false;
    }
    
    return result
})
.then(result => {
    console.log(result.answer);
    msg.text = result.answer;
    setTimeout(()=>{
      toggle(true);
    },100)
})
}

const suggested = document.querySelector("#suggested_qns ol");
console.log(suggested)
function display_suggested_qns(){

}






// logic








// select languages...
speechSynthesis.addEventListener('voiceschanged', populateVoices);
voicesDropdown.addEventListener('change', setVoice);


// voice to text (logic)
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = 'en-US';
let messageInput = "";

// press to record

let recording = false;
recordButton.addEventListener('click', () => {
  if(recording){
    recognition.stop();
    recording = !recording;
    console.log(recording, "recording stopped?")
    return;
  }
  console.log("start record")
  record_question()
  recording = !recording;
  console.log(recording)
})

// change background when asked question

const profile_pic_div = document.querySelector(".profile_pic")
text_area.addEventListener('change', () => {
  storeMSG()
});
askButton.addEventListener('click', () => {
  process_qn();
  show();
})

stopButton.addEventListener('click', () => {
  toggle(false);
  hide();
})




// https://stackoverflow.com/questions/67188765/using-fetch-with-javascript-and-django
