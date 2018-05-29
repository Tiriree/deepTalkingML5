//ML
let speech = new p5.Speech();
let speechRec = new p5.SpeechRec('en-US', gotSpeech);
let continuous = true;
let interim = false;

let lastSpeechTime=0;
let silenceAllowed=6000;
let clearingColor = [255, 24, 0];

//bots Peronality
let botPitch=1;
let botVoice=10;
let botSpeed=1.0;

//fonts stuff
let fonts = ['Impact', 'Arial', 'Arial Black', 'Helvetica', 'Gill Sans', 'Georgia'];
let fontSize = ['100', '200' , '300' , '400'];

//ML Text
const word2Vec = new ml5.Word2Vec('js/data/wordvecs10000.json', modelLoaded);
let modelReady = false;

function setup(){
  createCanvas(window.innerWidth, window.innerHeight);
  noCursor();
  background(255, 255, 255);
  speechRec.start(continuous, interim);
  initText();
}

function draw(){
  let now=millis();
  //if we think the speechRec stopped working
  // speechRec will stop listening by itself every couple of seconds, for this we
  // need to constantly check if it is still listening, if it isn't reset it
  if(lastSpeechTime+silenceAllowed<now){
    lastSpeechTime=millis();
    console.log("reseting");
    reset();
  }
}

function modelLoaded () {
  modelReady = true;
  initSpeech();//this function calls after everything is initialized, that way it ensures it is loaded.
}

//set speech variables, voice of bot, seed and pitch
function initSpeech(){
  speech.setPitch(botPitch);
  speech.setVoice(botVoice);
  speech.setRate(botSpeed);
}

//Select random font and size from predefined selection
function initText(){
  textAlign(CENTER);
  textFont(random(fonts));
  rectMode(CENTER);//make the text on center of screen
  textSize(random(fontSize));
}

//This function is automatically called everytime a word is heard
function gotSpeech() {
  lastSpeechTime=millis();
  if (speechRec.resultValue) {
    let input = speechRec.resultString;
    //ML
    var words=input.split(' ');
    var vecWords=[];
    for (var i=0;i<words.length;i++){
      var response= findNearest(words[i],1);
      vecWords.push(response);
    }
    var sentence=vecWords.join(' ');
    speech.speak(sentence);
    background(255);
    text(sentence, width/2, height/2, width,height);
    console.log(input);
  }
}


function findNearest(word, n) {
  if(word=='undefined'){
    return('');
  }
  console.log("finding nearest to ["+word+"]");
  if(modelReady){
    let nearest = word2Vec.nearest(word, n);
    if (!nearest) {
      // console.log("nothoing found");
      return '';
    }
    let output=[nearest.length];
    for (let i = 0; i < nearest.length; i++) {
      // output += nearest[i].vector + '<br/>';
      output[i] = nearest[i].vector;
    }
    randResponse=output[Math.floor(Math.random() * n)];
    console.log(output);
    return output;
  }
  return 'Model has not loaded yet!';
}

function  reset(){
  speechRec = new p5.SpeechRec('en-US', gotSpeech);
  speechRec.continuous = true; // do continuous recognition
  speechRec.interimResults = true; // allow partial recognition (faster, less accurate)
  speechRec.start(); // start engine
  //clear que for new text to come in so it can reset itself instead of listenting
  //to what it just said forever. I like to clear the que only sometimes
  if(random(100)>40){
    speech.cancel(); //cancel speech que.
    fill(245);
    fill(245);
    background(clearingColor);
    fill(0,0,0);
    console.log("clearing que");  }
}
