//import {drawWater} from 'svg.js';
let canvas;

let sf = 1; // scaleFactor
let x = 0; // pan X
let y = 0; // pan Y

let mx, my; // mouse coords;
let tx, ty;


let v1, v2;
let p;

let pinX = 19;
let pinY = 55;

let bg;
let water;

let display;
let scrollTo = null;

function preload() {
  bg = loadImage('img/aerial.png');
  water = loadImage('img/Water2.png');
}


function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.style("overscroll-behavior-y", "contain");
  canvas.mouseWheel(changeSize);
  tx = mouseX;
  ty = mouseY;

  display = createVector(windowWidth,windowHeight);
  //Pin Vectors (pseudo coordinates)
  v1 = createVector(1000,400);
  v2 = createVector(400, 200);

  //P tag with FA icon
  p = createP('<span class="pin" onclick="openPinInfo(v1)"><i class="fas fa-map-marker-alt"></i></span>');
  //p.position(v1.x - pinX, v1.y - pinY);

  //Initial Map Setting so it looks nice
  applyScale(map(windowWidth,500,1650,0.125,0.3));
  tx = windowWidth*0.5;
  ty = windowHeight*0.5;
  p.position((v1.x - pinX)+ tx, (v1.y - pinY) + ty);

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  //applyScale(sf);
  display.set(windowWidth, windowHeight);
  tx = windowWidth*0.5;
  ty = windowHeight*0.5;
  p.position((v1.x - pinX)+ tx, (v1.y - pinY) + ty);
}

function draw() {

  background(30,97,110);
  //background(255);
  //rectMode(CENTER);

  push();
  imageMode(CENTER);
  translate(tx, ty);
  scale(sf);
  image(bg,0,0);
  image(water,0,0);
  //drawWater();
  //rect(100, 100, 100, 100);
  //console.log(mouseX, mouseY);
  pop();
  //debug();
}

function debug() {
  strokeWeight(2);
  line(display.x/2, 0, display.x/2, display.y);
  line(0, display.y/2, display.x, display.y/2);
  //rect(v1.x + tx, v1.y + ty, 20, 20);
  //rect(v2.x + tx, v2.y + ty, 20, 20);
}

function mouseDragged(){
    //Stop Animating the Marker
    clearInterval(scrollTo);
    tx -= pmouseX - mouseX;
    ty -= pmouseY - mouseY;
    updateVector();
}

function mouseClicked() {
  //Stop Animating the Marker
  //clearInterval(scrollTo);
}

function scrollPinToCenter(pin){
    //Create a vector of the distance between them
    var m = createVector(windowWidth/2 - (pin.x + tx), windowHeight/2 - (pin.y + ty));
    move();

    //Interval Animation
    function move(){
    clearInterval(scrollTo);
    scrollTo = setInterval (frame, 15);
    function frame() {
      if (abs(m.x) < 0.1) {
        clearInterval(scrollTo);
      } else {
        m.set(windowWidth/2 - (pin.x + tx), windowHeight/2 - (pin.y + ty))
        //Incrementally make the difference from tx/ty and m.x/m.y = 0
        tx += m.x*0.2;
        ty += m.y*0.2;
        updateVector();
      }
    }
  }
}



function applyScale(s) {
    sf = sf * s;
    tx = mouseX * (1-s) + tx * s;
    ty = mouseY * (1-s) + ty * s;
    scaleVector(v1,s);
    scaleVector(v2,s);
    updateVector();
}

function openPinInfo(pin){
  //Open menu with info from that specific pin
  //let title = document.getElementById('title');
  //title.classList.toggle('hidden');
  scrollPinToCenter(pin);
}

function hide(){
  title.classList.toggle('hidden');
}

//Move the vectors when you drag
function updateVector(){
  p.position((v1.x - pinX) + tx, (v1.y - pinY) + ty);
}
//Move the vectors when you zoom
function scaleVector(a, s){
  a.x *= s;
  a.y *= s;
}

function changeSize(event) {
    applyScale(event.deltaY > 0 ? 1.05 : 0.95);
}
