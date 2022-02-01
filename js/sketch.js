let canvas;
let debug = false;

let sf = 1; // scaleFactor
let minZoom = 0.085;
let maxZoom = 0.5;
let x = 0; // pan X
let y = 0; // pan Y

// Transform tracker
let t;

// Pins to be loaded from JSON
let pinsData;
// Pins Array
let pins = [];
let pinScroll;
let pinTracker;
//Pin Offset related to CSS
let pinX = 50;
let pinY = 50;

let bg;
let water;

let display;
let scrollTo = null;

// Mobile Menu Setup
const menu = document.getElementById('menuList');

// Info Window Setup
const info = document.getElementById('info');
const infoTitle = document.getElementById('info-title');
const infoDescription = document.getElementById('info-description');
// Vimeo API setup
const iframe = document.getElementById('info-video');
const infoPlayer = new Vimeo.Player(iframe);

anime({
  targets: '#info-title, .info-video, .info-description',
  opacity: 0,
  duration: 100
});

// Disable pinch zoom on the canvas by ignoring the flag that specifies track pad
document.getElementById("map-main").addEventListener('wheel', event => {
  const { ctrlKey } = event
  if (ctrlKey) {
    event.preventDefault();
    return
  }
}, {
  passive: false
})


//Layer PNGs - could be SVGs
function preload() {
  bg = loadImage('img/aerial.png');
  water = loadImage('img/Water2.png');
  // Load Pins data
  pinsData = loadJSON('pins.json')
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.style("overscroll-behavior-y", "contain");
  canvas.parent('map-canvas');
  canvas.id("canvas");
  display = createVector(windowWidth, windowHeight);
  // Apply Zooming Function to mouseWheel
  canvas.mouseWheel(changeSize);

  // HAMMER for touch (to stop map from breaking on mobile)
  // set options to prevent default behaviors for swipe, pinch, etc
  let options = {
    preventDefault: true
  };

  // Target the container div for the entire map
  let hammer = new Hammer(document.querySelector('#map-canvas'), options);
  hammer.get('pinch').set({ enable: true });
  hammer.get('pan').set({ enable: true });
  // hammer.get('rotate').set({ enable: true });
  hammer.on("pinch", e => {
    changeSizeTouch(e)
  });


  t = createVector(display.x / 2, display.y / 2);

  //Pins (Center is 0,0 ; top left is -display.x/2 ... etc)
  // Setting Pins from JSON - only change is now the name is based on the array, instead of individual "name" property
  pinsData.pins.forEach((pin, index) => {
    // Push new array elements with name pin[index], x and y offsets, info for interface
    pins.push(new Pin("pins[" + index + "]",
      pinsData.pins[index].x,
      pinsData.pins[index].y,
      pinX, pinY,
      pinsData.pins[index].info))
  });

  //Initial Map Setting so it looks nice
  applyScale(map(windowWidth, 500, 1650, 0.125, 0.3));
  t.x = windowWidth * 0.5;
  t.y = windowHeight * 0.5;
  pins.forEach((pin) => pin.setP(t.x, t.y));
}

// Handle window resizing for Sketch
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  //applyScale(sf);
  display.set(windowWidth, windowHeight);
  t.x = windowWidth * 0.5;
  t.y = windowHeight * 0.5;
  updateVector();
}

function draw() {

  background(30, 97, 110);
  // background(172, 193, 206);

  push();
  imageMode(CENTER);
  translate(t.x, t.y);
  scale(sf);
  image(bg, 0, 0);
  image(water, 0, 0);
  pop();

  runDebug();
}
let test;
function runDebug() {
  if (debug) {
    strokeWeight(2);
    line(display.x / 2, 0, display.x / 2, display.y);
    line(0, display.y / 2, display.x, display.y / 2);


    //rect(v2.x + t.x, v2.y + t.y, 20, 20);
  }
}

function mouseDragged(e) {
  // Only adjust map if dragging on it (don't adjust while clicking elsewhere)
  if (e.target === canvas.canvas) {
    //Stop Animating the Marker
    // clearInterval(scrollTo);
    // Anime way to pause the animation if scrolling
    if (pinScroll) pinScroll.pause();
    // Update t vector based on mouse movement
    t.x -= pmouseX - mouseX;
    t.y -= pmouseY - mouseY;
    updateVector();
  }
}

// Animate the map to center a pin
function scrollPinToCenter(pin, callback) {
  // Create a vector of the distance between them
  // let m = createVector(windowWidth / 2 - (pin.x + t.x), windowHeight / 2 - (pin.y + t.y));
  //
  // move();
  //
  // // Interval Animation
  // function move() {
  //   clearInterval(scrollTo);
  //   scrollTo = setInterval(frame, 15);
  //
  //   function frame() {
  //     if (abs(m.x) < 0.1) {
  //       clearInterval(scrollTo);
  //     } else {
  //       m.set(windowWidth / 2 - (pin.x + t.x), windowHeight / 2 - (pin.y + t.y))
  //       //Incrementally make the difference from t.x/t.y and m.x/m.y = 0
  //       t.x += m.x * 0.2;
  //       t.y += m.y * 0.2;
  //       updateVector();
  //     }
  //   }
  // }
  if (!menu.classList.contains('menu-hidden')) toggleMenu();
  // ANIME Version
  pinScroll = anime({
    targets: t,
    x: (display.x / 2) - pin.x,
    y: (display.y / 2) - pin.y,
    round: 1,
    duration: 500,
    easing: 'easeOutExpo',
    update: function() {
      updateVector();
    },
    complete: (anim) => {
      // console.log('pin move done');
      callback();
    }
  });
}

function openPinInfo(pin) {
  // If it's not the same pin you clicked last time, then proceed
  if (pin !== pinTracker) {
    //Fade out content
    anime({
      targets: '#info-title, .info-video, .info-description',
      opacity: 0,
      duration: () => {
        // Make fade time 0 if the info window is hidden
        let fadeTime = !info.classList.contains('info-hidden') * 500;
        return fadeTime;
      },
      begin: () => {
        // console.log('fade out...');
      },
      complete: (anim) => {
        //Center the pin, then proceed
        scrollPinToCenter(pin.v, () => {
          // console.log('loading elements...');

          //Open menu with info from that specific pin
          //Show Info menu if it's hidden
          if (info.classList.contains('info-hidden')) toggleInfo();
          //Load new content
          infoTitle.innerText = pin.info.title;
          infoDescription.innerText = pin.info.description;
          infoPlayer.loadVideo(pin.info.video);
          //Fade in content
          anime({
            targets: '#info-title, .info-video, .info-description',
            opacity: 1,
            duration: 1000,
            delay: 100,
            easing: 'easeInCubic',
            complete: (anim) => {
              // console.log('fade-in done');
            }
          });
        });
      }
    });
  } else {
    // If not a new pin only manage the hidden CSS
    if (info.classList.contains('info-hidden')) toggleInfo();
  }
  // Update the pin tracker variable
  pinTracker = pin;
}

// Show/Hide the info panel via CSS
function toggleInfo() {
  info.classList.toggle('info-hidden');
}

function toggleMenu(){
  menu.classList.toggle('menu-hidden');
}

//Move the vectors for all the pins for dragging, zooming, etc.
function updateVector() {
  pins.forEach((pin) => pin.setP(t.x, t.y));
}

// Map Zoom Feature
function applyScale(s) {
  sf = sf * s;
  t.x = mouseX * (1 - s) + t.x * s;
  t.y = mouseY * (1 - s) + t.y * s;

  pins.forEach((pin) => pin.scaleVector(s));
  updateVector();
}

// Zoom on wheeel events (with zoom constraint)
function changeSize(e) {
  // applyScale(e.deltaY > 0 ? 1.05 : 0.95);
  let dy = e.deltaY > 0 ? 1.05 : 0.95;
  let testScale = sf * dy;
  // applyScale(dy);
  // Only permit zooming if the testScale is within bounds
  if (testScale >= minZoom && testScale <= maxZoom ){
    applyScale(dy);
  }
}
  let pdy = 0;
  // Zoom on wheeel events (with zoom constraint)
  function changeSizeTouch(e) {
    let dy = e.scale - pdy > 0 ? 1.05 : 0.95;
    // Shitty way to debug since mobile has no console
    // infoDescription.innerText = dy;
    let testScale = sf * dy;

    if (testScale >= minZoom && testScale <= maxZoom ){
      applyScale(dy);
    }
    pdy = e.scale;
}
