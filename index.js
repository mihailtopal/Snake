let score = 0;
let bestScore = 0;
let intervalId;
let speed = 300;
let headPosition;
let direction = "down";
let eatApple = false;
let theGameWasOver = false;
let lastKeyPressTime = 0;
let minKeyPressInterval = 70;
let directionOfMovement = {
  38: "up",
  37: "left",
  39: "right",
  40: "down",
};
let taleCoordinates = {
  x: 7,
  y: 7,
};
let nextTaleDirection = ["down"];
let place = newPlace();
displayBoard(place);

document.getElementById("scoreValue").innerText = score;
document.getElementById("bestScoreValue").innerText = bestScore;
document.addEventListener("keydown", (key) => directionByPressingTheKey(key));

function displayBoard(place) {
  const gameBoard = document.getElementById("game-board");
  gameBoard.innerHTML = "";

  for (let y = 0; y < place.length; y++) {
    for (let x = 0; x < place[y].length; x++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      if (place[y][x] == 1) cell.classList.add(`body`);
      else if (place[y][x] == 2) cell.classList.add(`head`);
      else if (place[y][x] == 3) cell.classList.add(`apple`);
      else cell.classList.add(`dead`);
      gameBoard.appendChild(cell);
    }
  }
}

function move() {
  headPosition = findTheHead();
  place[headPosition.y][headPosition.x] = 1;

  if (direction == "down") moveDown();
  else if (direction == "up") moveUp();
  else if (direction == "left") moveLeft();
  else if (direction == "right") moveRight();

  coliseum(headPosition);
  nextTaleDirection.push(direction);
  displayBoard(place);

  newTaleCoordinates();
}

function startGame() {
  if (!intervalId && !theGameWasOver) {
    intervalId = setInterval(function () {
      score = nextTaleDirection.length - 1;
      document.getElementById("scoreValue").innerText = score;
      move(direction);
    }, speed);
  }
}

function moveDown() {
  if (headPosition.y + 1 < place.length) {
    headPosition.y += 1;
  } else headPosition.y = 0;
}

function moveUp() {
  if (headPosition.y - 1 >= 0) {
    headPosition.y -= 1;
  } else headPosition.y = place.length - 1;
}

function moveLeft() {
  if (headPosition.x - 1 >= 0) {
    headPosition.x -= 1;
  } else headPosition.x = place[0].length - 1;
}

function moveRight() {
  if (headPosition.x + 1 < place[0].length) {
    headPosition.x += 1;
  } else headPosition.x = 0;
}

function newTaleCoordinates() {
  if (!eatApple) {
    switch (nextTaleDirection[0]) {
      case "down":
        taleCoordinates.y = (taleCoordinates.y + 1) % place.length;
        nextTaleDirection.shift();
        break;
      case "left":
        taleCoordinates.x - 1 < 0
          ? (taleCoordinates.x = place[0].length - 1)
          : (taleCoordinates.x -= 1);
        nextTaleDirection.shift();
        break;
      case "up":
        taleCoordinates.y - 1 < 0
          ? (taleCoordinates.y = place.length - 1)
          : (taleCoordinates.y -= 1);
        nextTaleDirection.shift();
        break;
      case "right":
        taleCoordinates.x = (taleCoordinates.x + 1) % place[0].length;
        nextTaleDirection.shift();
        break;
    }
  } else
    while (eatApple) {
      let x = Math.floor(Math.random() * place[0].length);
      let y = Math.floor(Math.random() * place.length);
      if (place[y][x] === 0) {
        place[y][x] = 3;
        eatApple = false;
      }
    }
}

function findTheHead() {
  for (let y = 0; y < place.length; y++) {
    for (let x = 0; x < place[y].length; x++) {
      if (place[y][x] === 2)
        return {
          x: x,
          y: y,
        };
    }
  }
}
function coliseum(headPosition) {
  if (place[headPosition.y][headPosition.x] === 1) {
    gameOver();
  }
  if (place[headPosition.y][headPosition.x] === 3) {
    eatApple = true;
  }
  place[headPosition.y][headPosition.x] = 2;

  if (!eatApple) {
    place[taleCoordinates.y][taleCoordinates.x] = 0;
  }
}
function newPlace() {
  return [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];
}
function directionByPressingTheKey(e) {
  let currentTime = new Date().getTime();

  if (currentTime - lastKeyPressTime < minKeyPressInterval) {
    return;
  }

  if (correctDirectionCheck(e)) {
    stopGame();
    direction = directionOfMovement[e.keyCode];
    move(direction);
    lastKeyPressTime = currentTime;
    startGame();
  }
}
function correctDirectionCheck(e) {
  return (
    ((e.keyCode === 38 || e.keyCode === 40) &&
      direction !== "down" &&
      direction !== "up") ||
    ((e.keyCode === 39 || e.keyCode === 37) &&
      direction !== "right" &&
      direction !== "left")
  );
}
function openModal() {
  document.getElementById("gameOverModal").style.display = "block";
  document.getElementById("scoreValueModal").textContent = score;
  document.getElementById("scoreValueModal").style.display = "block";
}

function closeModal() {
  document.getElementById("gameOverModal").style.display = "none";

  taleCoordinates = {
    x: 7,
    y: 7,
  };
  place = newPlace();
  displayBoard(place);
  nextTaleDirection = ["down"];
  direction = "down";

  score > bestScore ? (bestScore = score) : 0;
  document.getElementById("bestScoreValue").innerText = bestScore;
  score = 0;
  document.getElementById("scoreValue").innerText = score;
  theGameWasOver = false;
}
function gameOver() {
  theGameWasOver = true;
  stopGame();
  clearInterval(intervalId);
  intervalId = null;
  openModal();
}
function stopGame() {
  clearInterval(intervalId);
  intervalId = null;
}
