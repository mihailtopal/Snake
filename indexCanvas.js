let score = 0; // Текущий счет
let bestScore = 0; // Лучший счет
let intervalId; // ID интервала для анимации движения
let speed = 300; // Скорость игры (интервал обновлений)
let headPosition; // Координаты головы змейки
let direction = "down"; // Направление движения змейки
let eatApple = false; // Флаг поедания яблока
let theGameWasOver = false; // Флаг завершения игры
let lastKeyPressTime = 0; // Время последнего нажатия клавиши
let minKeyPressInterval = 70; // Минимальный интервал между нажатиями клавиш
let directionOfMovement = { // Сопоставление клавиш с направлениями
  38: "up",
  37: "left",
  39: "right",
  40: "down",
};
let taleCoordinates = { // Координаты хвоста змейки
  x: 7,
  y: 7,
};
let nextTaleDirection = ["down"]; // Массив направлений для хвоста
let place = newPlace(); // Инициализация игрового поля

// Обновление значений счетов на странице
document.getElementById("scoreValue").innerText = score;
document.getElementById("bestScoreValue").innerText = bestScore;
document.addEventListener("keydown", (key) => directionByPressingTheKey(key));

const canvas = document.getElementById("board");
const board = canvas.getContext("2d");

// Функция отрисовки игрового поля
function drowBoard(place) {
  board.clearRect(0, 0, 640, 640); // Очистка холста
  for (let y = 0; y < place.length; y++) {
    for (let x = 0; x < place[y].length; x++) {
      if (place[y][x] === 1) board.fillStyle = "black"; // Тело змейки
      else if (place[y][x] === 2) board.fillStyle = "green"; // Голова змейки
      else if (place[y][x] === 3) board.fillStyle = "red"; // Яблоко
      else board.fillStyle = "gray"; // Пустое пространство
      board.fillRect(x * 39 + 9, y * 39 + 9, 38, 38); // Рисуем квадрат
    }
  }
}

// Очистка клетки
function clearCell(x, y) {
  board.fillStyle = "gray";
  board.fillRect(x * 39 + 9, y * 39 + 9, 38, 38);
}

// Отрисовка клетки с определенным цветом
function drawCell(x, y, color) {
  board.fillStyle = color;
  board.fillRect(x * 39 + 9, y * 39 + 9, 38, 38);
}

drowBoard(place); // Отрисовка начального состояния поля

// Функция движения змейки
function move() {
  headPosition = findTheHead(); // Находим текущую позицию головы
  clearCell(taleCoordinates.x, taleCoordinates.y); // Очищаем хвост
  drawCell(headPosition.x, headPosition.y, "black"); // Очищаем старую голову
  place[headPosition.y][headPosition.x] = 1; // Обновляем значение клетки для старой головы
  
  // Двигаем змейку в зависимости от направления
  if (direction === "down") moveDown();
  else if (direction === "up") moveUp();
  else if (direction === "left") moveLeft();
  else if (direction === "right") moveRight();
  
  coliseum(headPosition); // Проверяем столкновения
  nextTaleDirection.push(direction); // Добавляем текущее направление в массив направлений
  newTaleCoordinates(); // Обновляем координаты хвоста
  drawCell(headPosition.x, headPosition.y, "green"); // Отрисовываем новую голову
}

// Запуск игры
function startGame() {
  if (!intervalId && !theGameWasOver) {
    intervalId = setInterval(function () {
      score = nextTaleDirection.length - 1; // Обновляем счет
      document.getElementById("scoreValue").innerText = score;
      move(direction); // Двигаем змейку
    }, speed);
  }
}

// Двигаем змейку вниз
function moveDown() {
  if (headPosition.y + 1 < place.length) {
    headPosition.y += 1;
  } else headPosition.y = 0; // Переход на верхнюю строку
}

// Двигаем змейку вверх
function moveUp() {
  if (headPosition.y - 1 >= 0) {
    headPosition.y -= 1;
  } else headPosition.y = place.length - 1; // Переход на нижнюю строку
}

// Двигаем змейку влево
function moveLeft() {
  if (headPosition.x - 1 >= 0) {
    headPosition.x -= 1;
  } else headPosition.x = place[0].length - 1; // Переход на крайний правый столбец
}

// Двигаем змейку вправо
function moveRight() {
  if (headPosition.x + 1 < place[0].length) {
    headPosition.x += 1;
  } else headPosition.x = 0; // Переход на крайний левый столбец
}

// Обновление координат хвоста и генерация нового яблока
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
  } else {
    // Генерация нового яблока в случайной пустой клетке
    while (eatApple) {
      let x = Math.floor(Math.random() * place[0].length);
      let y = Math.floor(Math.random() * place.length);
      if (place[y][x] === 0) {
        place[y][x] = 3;
        eatApple = false;
        drowBoard(place); // Отрисовка обновленного поля
      }
    }
  }
}

// Поиск позиции головы змейки
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

// Проверка на столкновение с собой или яблоком
function coliseum(headPosition) {
  if (place[headPosition.y][headPosition.x] === 1) {
    gameOver(); // Если столкновение с телом змейки
  }
  if (place[headPosition.y][headPosition.x] === 3) {
    eatApple = true; // Если яблоко съедено
  }
  place[headPosition.y][headPosition.x] = 2; // Обновляем значение клетки для головы змейки
  
  if (!eatApple) {
    place[taleCoordinates.y][taleCoordinates.x] = 0; // Очищаем старое положение хвоста
  }
}

// Инициализация нового игрового поля
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

// Обработка нажатия клавиш для смены направления
function directionByPressingTheKey(e) {
  let currentTime = new Date().getTime();
  
  if (currentTime - lastKeyPressTime < minKeyPressInterval) {
    return; // Игнорируем нажатие, если прошло мало времени
  }
  
  if (correctDirectionCheck(e)) {
    stopGame(); // Останавливаем игру перед изменением направления
    direction = directionOfMovement[e.keyCode]; // Обновляем направление
    move(direction); // Немедленно применяем новое направление
    lastKeyPressTime = currentTime; // Обновляем время последнего нажатия
    startGame(); // Запускаем игру снова
  }
}

// Проверка корректности нового направления
function correctDirectionCheck(e) {
  return (
    ((e.keyCode === 38 || e.keyCode === 40) && direction !== "down" && direction !== "up") ||
    ((e.keyCode === 39 || e.keyCode === 37) && direction !== "right" && direction !== "left")
  );
}

// Открытие модального окна с результатами игры
function openModal() {
  document.getElementById("gameOverModal").style.display = "block";
  document.getElementById("scoreValueModal").textContent = score;
  document.getElementById("scoreValueModal").style.display = "block";
}

// Закрытие модального окна и сброс игры
function closeModal() {
  document.getElementById("gameOverModal").style.display = "none";
  
  taleCoordinates = { x: 7, y: 7 }; // Инициализация координат хвоста
  place = newPlace(); // Перезапуск игрового поля
  drowBoard(place); // Отрисовка нового игрового поля
  nextTaleDirection = ["down"]; // Сброс направлений хвоста
  direction = "down"; // Сброс направления
  
  // Обновление лучшего счета, если текущий счет выше
  score > bestScore ? (bestScore = score) : 0;
  document.getElementById("bestScoreValue").innerText = bestScore;
  score = 0; // Сброс текущего счета
  document.getElementById("scoreValue").innerText = score;
  theGameWasOver = false; // Разрешение игры
}

// Завершение игры
function gameOver() {
  theGameWasOver = true;
  stopGame(); // Остановка игрового процесса
  clearInterval(intervalId); // Очистка интервала
  intervalId = null;
  openModal(); // Открытие модального окна
}

// Остановка игры и очистка интервала
function stopGame() {
  clearInterval(intervalId);
  intervalId = null;
}
