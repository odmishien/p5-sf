let fontAnurati, fontUbuntu;

let rect_w;
let rect_h;
let rect_x;
let rect_y;

let text_x;
let text_y;
let text_counter = 1;

let windowCounter = 0;
let window_w = 600;
let window_h = 300;

var xoff = 0;
var yoff = 100;

let numArray = [0, 1];

let messages = ["Downloading...", "Decrypting...", "Building..."];
let subMessages = [
  "local status=$(echo ${PIPESTATUS[@]})",
  'local SETCOLOR_SUCCESS="echo -en \\033[1;32m"',
  "local SETCOLOR s",
  "for s in ${status}",
  "if [ ${s} -gt 100 ]; then",
  "SETCOLOR=${SETCOLOR_FAILURE}",
  "elif [ ${s} -gt 0 ]; then",
  'echo "(rc->${status// /|})"',
  "PROMPT_COMMAND='__show_status;'${PROMPT_COMMAND//__show_status;/}"
];

let isOpeningDone = false;

let backgroundCanvas = p => {
  p.setup = () => {
    fontAnurati = p.loadFont("fonts/Anurati-Regular.otf");
    fontUbuntu = p.loadFont("fonts/UbuntuMono-Regular.ttf");
    p.createCanvas(p.displayWidth, p.displayHeight);
    p.background(51);
    p.frameRate(20);
    rect_w = p.displayWidth;
    rect_h = 100;
    rect_x = 10;
    rect_y = p.displayHeight / 2;
    text_y = p.displayHeight / 2;
    rh1 = p.random(100,250);
    rh2 = p.random(200,250); 
  };
  p.draw = () => {
    if (!isOpeningDone) {
      openingText(p);
    }
    if (isOpeningDone) {
      p.frameRate(30);
      p.background(51);
      matrix(p);
      p.stroke(72, 255, 0);
      p.line(0, p.displayHeight / 2, p.displayWidth, p.displayHeight / 2);
      p.line(p.displayWidth / 2, 0, p.displayWidth / 2, p.displayHeight);
      graph(p);
    }
  };
};

let windowsCanvas = p => {
  p.setup = () => {
    p.createCanvas(p.displayWidth, p.displayHeight);
  };
  p.draw = () => {
    if (isOpeningDone && p.keyIsPressed && windowCounter < 10) {
      windowCounter += 1;
      let div = p.createDiv();
      div.parent("container");
      let randomId = Math.random()
        .toString(32)
        .substring(2);
      div.id(randomId);
      div.style("position:absolute");
      new p5(windowCanvas, randomId);
    }
  };
};

let windowCanvas = p => {
  p.setup = () => {
    p.createCanvas(p.displayWidth, p.displayHeight);
    progressBarWindow(p);
  };
};

async function openingText(p) {
  let texts = ["H", "E", "L", "L", "O"];
  if (text_counter <= texts.length) {
    p.background(51);
    text_x = p.displayWidth / 2;
    p.textSize(32);
    p.fill(72, 255, 0);
    p.textFont(fontAnurati);
    for (let i = 0; i < text_counter; i++) {
      p.text(texts[i], text_x, text_y);
      text_x += 40;
    }
    text_counter += 1;
  } else {
    await sleep(3);
    p.background(51);
    isOpeningDone = true;
  }
}

function sleep(sec) {
  return new Promise(resolve => setTimeout(resolve, sec * 1000));
}

function matrix(p) {
  p.textFont(fontUbuntu);
  p.textSize(20);
  p.fill("rgba(72, 255, 0, 0.8)");
  var step = 30;
  for (var gridX = 0; gridX < p.windowWidth / 2; gridX += step) {
    for (var gridY = 0; gridY < p.windowHeight / 2; gridY += step) {
      p.text(p.random(numArray), gridX, gridY);
    }
  }
}

function graph(p) {
  let upperGraphX = p.displayWidth / 2 + 50;
  let upperGraphY = p.displayHeight / 4;
  let lowerGraphX = p.displayWidth / 2 + 50;
  let lowerGraphY = p.displayHeight / 2;
  p.line(upperGraphX, upperGraphY, upperGraphX, 30);
  p.line(upperGraphX, upperGraphY, p.displayWidth - 30, upperGraphY);
  p.line(lowerGraphX, lowerGraphY, lowerGraphX, upperGraphY + 30);
  p.line(lowerGraphX, lowerGraphY, p.displayWidth - 30, lowerGraphY);
  p.noStroke();
  p.fill("rgba(72, 255, 0, 0.6)");
  var rh1 = p.map(p.noise(xoff),0,1,0,p.displayHeight/4);
  var rh2 = p.map(p.noise(yoff),0,1,0,p.displayHeight/4);
  xoff +=0.01;
  yoff +=0.01;

  p.beginShape();
  p.curveVertex(0,  rh1);
  p.curveVertex(0,  rh1);
  p.curveVertex(400/3,  rh1);
  p.curveVertex(2*400/3,  rh2);
  p.curveVertex(400,  rh2);
  p.curveVertex(400,  rh2);
  p.endShape();
}

async function progressBarWindow(p) {
  let max_x = p.windowWidth - 200;
  let max_y = p.windowHeight - 200;
  let min = 10;
  let window_w = 600;
  let window_h = 300;
  let window_x = Math.floor(Math.random() * (max_x + 1 - min)) + min;
  let window_y = Math.floor(Math.random() * (max_y + 1 - min)) + min;
  let text_x = window_x + 100;
  let text_y = window_y + 100;
  let bar_x = window_x + 100;
  let bar_y = window_y + 150;
  let subtext_x = window_x + 100;
  let subtext_y = window_y + 200;
  let bar_section = 20;
  let bar_height = 30;
  let bar_width = 450;

  p.fill("rgba(0,0,0,0.5)");
  p.stroke("#48ff00");
  p.rect(window_x, window_y, window_w, window_h);

  p.textFont(fontUbuntu);
  p.textSize(30);
  p.fill(72, 255, 0);
  p.text(p.random(messages), text_x, text_y);

  p.textSize(15);
  p.text(p.random(subMessages), subtext_x, subtext_y);
  await sleep(0.5);
  p.text(p.random(subMessages), subtext_x, subtext_y + 30);

  p.noFill();
  p.stroke("#48ff00");
  p.rect(bar_x, bar_y, bar_width, bar_height);

  let bar_section_width = bar_width / bar_section;

  for (let i = 0; i < bar_section; i++) {
    bar_section_x = bar_x + bar_section_width * i;
    p.fill("rgba(72, 255, 0, 0.5)");
    p.noStroke();
    p.rect(bar_section_x, bar_y, bar_section_width, bar_height);
    let interval = Math.random() * 0.2;
    await sleep(interval);
  }
  windowCounter -= 1;
  p.remove();
}

new p5(backgroundCanvas, "background");
new p5(windowsCanvas, "window");
