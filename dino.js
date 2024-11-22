//board
let board;
let boardWidth = 800;
let boardHeight = 350;
let context;

//dino
let dinoWidth = 88;
let dinoHeight = 94;
let dinoX = 50;
let dinoY = boardHeight - dinoHeight;
let dinoImg;

let dino = {
  x: dinoX,
  y: dinoY,
  width: dinoWidth,
  height: dinoHeight,
};

//cactus
let cactusArray = [];

let cactus1Width = 34;
let cactus2Width = 69;
let cactus3Width = 102;

let cactusHeight = 70;
let cactusX = 700;
let cactusY = boardHeight - cactusHeight;

let cactus1Img;
let cactus2Img;
let cactus3Img;

//physics
let velocityX = -8; //cactus moving left speed
let velocityY = 0;
let gravity = 0.4;

let gameOver = false;
let score = 0;

window.onload = function () {
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;

  context = board.getContext("2d"); //used for drawing on the board

  //draw initial dinosaur
  // context.fillStyle="green";
  // context.fillRect(dino.x, dino.y, dino.width, dino.height);

  dinoImg = new Image();
  dinoImg.src = "./img/dino.png";
  dinoImg.onload = function () {
    context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
  };

  cactus1Img = new Image();
  cactus1Img.src = "./img/cactus1.png";

  cactus2Img = new Image();
  cactus2Img.src = "./img/cactus2.png";

  cactus3Img = new Image();
  cactus3Img.src = "./img/cactus3.png";

  requestAnimationFrame(update);
  setInterval(placeCactus, 1000); //1000 milliseconds = 1 second
  document.addEventListener("keydown", moveDino);
};

function update() {
  requestAnimationFrame(update);
  if (gameOver) {
    return;
  }
  context.clearRect(0, 0, board.width, board.height); //Reset the canvas

  //dino
  velocityY += gravity;
  dino.y = Math.min(dino.y + velocityY, dinoY); //apply gravity to current dino.y, making sure it doesn't exceed the ground
  context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);

  //cactus
  for (let i = 0; i < cactusArray.length; i++) {
    let cactus = cactusArray[i];
    cactus.x += velocityX;
    context.drawImage(
      cactus.img,
      cactus.x,
      cactus.y,
      cactus.width,
      cactus.height
    );

    if (detectCollision(dino, cactus)) {
      gameOver = true;
      dinoImg.src = "./img/dino-dead.png";
      showpopup();
      showRestartButton();
      dinoImg.onload = function () {
        context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
      };
    }
  }

  //score
  context.fillStyle = "white";
  context.font = "20px courier bolder";
  context.innerText = "Score:";
  score++;
  context.fillText(score, 5, 20);
}

function moveDino(e) {
  if (gameOver) {
    return;
  }

  if ((e.code == "Space" || e.code == "ArrowUp") && dino.y == dinoY) {
    //jump
    velocityY = -10;
  }
}

function placeCactus() {
  if (gameOver) {
    return;
  }

  //place cactus
  let cactus = {
    img: null,
    x: cactusX,
    y: cactusY,
    width: null,
    height: cactusHeight,
  };

  let placeCactusChance = Math.random(); //0 - 0.9999...

  if (placeCactusChance > 0.9) {
    //10% you get cactus3
    cactus.img = cactus3Img;
    cactus.width = cactus3Width;
    cactusArray.push(cactus);
  } else if (placeCactusChance > 0.7) {
    //30% you get cactus2
    cactus.img = cactus2Img;
    cactus.width = cactus2Width;
    cactusArray.push(cactus);
  } else if (placeCactusChance > 0.5) {
    //50% you get cactus1
    cactus.img = cactus1Img;
    cactus.width = cactus1Width;
    cactusArray.push(cactus);
  }

  if (cactusArray.length > 5) {
    cactusArray.shift(); //remove the first element from the array so that the array doesn't constantly grow
  }
}

function detectCollision(a, b) {
  return (
    a.x < b.x + b.width && //a's top left corner doesn't reach b's top right corner
    a.x + a.width > b.x && //a's top right corner passes b's top left corner
    a.y < b.y + b.height && //a's top left corner doesn't reach b's bottom left corner
    a.y + a.height > b.y
  ); //a's bottom left corner passes b's top left corner
}

function showpopup() {
  var popup = document.createElement("div");
  var board = document.getElementById("board");

  popup.innerHTML = "You Lost!!!"; // You can customize the popup content here
  popup.style.position = "fixed";
  popup.style.top = "55%";
  popup.style.left = "50%";
  popup.style.transform = "translate(-50%, -50%)";
  popup.style.backgroundColor = "transparent";
  popup.style.color = "lightgrey";
  popup.style.padding = "20px";
  popup.style.border = "2px solid transparent";
  popup.style.zIndex = "9999";
  board.style.backgroundColor = "#000814";

  document.body.appendChild(popup);
}

function showRestartButton() {
  var restartButton = document.createElement("button");
  restartButton.innerText = "Restart Game";
  restartButton.style.position = "fixed";
  restartButton.style.top = "63%";
  restartButton.style.left = "50%";
  restartButton.style.transform = "translate(-50%, -50%)";
  restartButton.style.padding = "8px 15px";
  restartButton.style.fontSize = "16px";
  restartButton.style.backgroundColor = "lightgrey";
  restartButton.style.color = "black";
  restartButton.style.border = "none";
  restartButton.style.borderRadius = "5px";
  restartButton.style.cursor = "pointer";
  restartButton.style.zIndex = "9999";

  restartButton.addEventListener("click", function () {
    restartGame();
    // Remove the restart button
    document.body.removeChild(restartButton);
    // Remove the game over popup
    document.body.removeChild(document.querySelector("div"));
  });

  document.body.appendChild(restartButton);
}

let cactusInterval; // Variable to store the interval ID

function restartGame() {
  // Reset game variables
  dino.y = dinoY;
  velocityY = 0;
  score = 0;
  cactusArray = [];
  gameOver = false;

  // Clear any previous cactus placement intervals
  if (cactusInterval) {
    clearInterval(cactusInterval);
  }

  // Restart cactus placement interval
  cactusInterval = setInterval(placeCactus, 1000);

  // Clear the canvas and start drawing the dino again
  context.clearRect(0, 0, board.width, board.height);
  context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);

  // Restart the game loop
  requestAnimationFrame(update);
}
