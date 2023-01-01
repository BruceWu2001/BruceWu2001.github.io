

const msg = new SpeechSynthesisUtterance();
let voices = [];
const voiceinator = document.querySelector('.voiceinator');
const voicesDropdown = document.querySelector('[name="voice"]');
const recordButton = document.querySelector('#record');
const askButton = document.querySelector('#ask');
const stopButton = document.querySelector('#stop');
const text_area = document.querySelector('[name="text"]');
// msg.text = document.querySelector('[name="text"]').value; this is the msg tobe spoken
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

// select languages...
speechSynthesis.addEventListener('voiceschanged', populateVoices);
voicesDropdown.addEventListener('change', setVoice);


let messageInput = "";
function storeMSG() {
    messageInput = text_area.value;
    console.log(messageInput);
}


// voice to text (logic)
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = 'en-US';

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
    text_area.addEventListener('change', () => {
      storeMSG()
  });
})


function show(){
    console.log(this);
    profile_pic_div.classList.remove('behind')
    voiceinator.classList.add('behind')

}

function hide(){
    profile_pic_div.classList.add('behind')
    voiceinator.classList.remove('behind')
}



const profile_pic_div = document.querySelector(".profile_pic")
askButton.addEventListener('click', show)
stopButton.addEventListener('click', () => {
  // toggle(false);
  hide();
})


// messageInput will store the message of the questioner
// 1. create a list of possible questions and answer dictionary
// const faq = document.querySelector('#FAQ');
// const data = require('faq.txt')
// console.log(data)

// 2. analyse input and match output