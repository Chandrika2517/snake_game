const startButton = document.getElementById('startButton');
const startScreen = document.getElementById('startScreen');
const levelScreen = document.getElementById('levelScreen');
const gameScreen = document.getElementById('gameScreen');
const levelsDiv = document.getElementById('levels');
const gameCanvas = document.getElementById('gameCanvas');
const ctx = gameCanvas.getContext('2d');
const levelTitle = document.getElementById('levelTitle');
const scoreDiv = document.getElementById('score');
const pauseButton = document.getElementById('pauseButton');
const endButton = document.getElementById('endButton');

const levels = 50;
let currentLevel = 1;
let score = 0;
let snake = [{ x: 10, y: 10 }];
let direction = { x: 1, y: 0 };
let food = { x: 15, y: 15 };
let speed = 50;
let interval;
let isPaused = false;

function initializeLevels() {
    for (let i = 1; i <= levels; i++) {
        const levelButton = document.createElement('button');
        levelButton.textContent = i;
        levelButton.className = 'levelButton';
        if (i === 50) {
            levelButton.classList.add('tooltip');
            levelButton.title = 'Complete previous levels first';
        }
        levelButton.disabled = true;
        levelButton.addEventListener('click', () => startGame(i));
        levelsDiv.appendChild(levelButton);
    }
    updateLevelButtons();
}

function updateLevelButtons() {
    for (let i = 0; i < levelsDiv.children.length; i++) {
        const button = levelsDiv.children[i];
        if (i < currentLevel) {
            button.disabled = false;
            button.classList.add('passed');
        }
    }
}

function startGame(level) {
    currentLevel = level;
    score = 0;
    snake = [{ x: 10, y: 10 }];
    direction = { x: 1, y: 0 };
    speed = Math.max(50, 100 * Math.pow(1.05, level - 1)); // Minimum speed limit
    levelTitle.textContent = `Level ${level}`;
    scoreDiv.textContent = `Score: ${score}`;
    clearInterval(interval);
    interval = setInterval(gameLoop, speed);

    startScreen.style.display = 'none';
    levelScreen.style.display = 'none';
    gameScreen.style.display = 'block';
}

function gameLoop() {
    if (!isPaused) {
        updateSnake();
        if (checkCollision()) {
            clearInterval(interval);
            alert('Game Over!');
            levelScreen.style.display = 'block';
            gameScreen.style.display = 'none';
            updateLevelButtons();
            return;
        }
        if (checkFood()) {
            score++;
            scoreDiv.textContent = `Score: ${score}`;
            placeFood();
            if (score >= 30) {
                currentLevel++;
                if (currentLevel > levels) {
                    alert('You completed all levels!');
                    clearInterval(interval);
                    levelScreen.style.display = 'block';
                    gameScreen.style.display = 'none';
                } else {
                    startGame(currentLevel);
                }
            }
        }
        draw();
    }
}

function updateSnake() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head);
    snake.pop();
}

function checkCollision() {
    const head = snake[0];
    if (head.x < 0 || head.y < 0 || head.x >= gameCanvas.width / 10 || head.y >= gameCanvas.height / 10) {
        return true;
    }
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            return true;
        }
    }
    return false;
}

function checkFood() {
    const head = snake[0];
    if (head.x === food.x && head.y === food.y) {
        snake.push({ x: food.x, y: food.y });
        return true;
    }
    return false;
}

function placeFood() {
    let newFoodPosition;
    do {
        newFoodPosition = {
            x: Math.floor(Math.random() * (gameCanvas.width / 10)),
            y: Math.floor(Math.random() * (gameCanvas.height / 10))
        };
    } while (snake.some(segment => segment.x === newFoodPosition.x && segment.y === newFoodPosition.y));
    food = newFoodPosition;
}

function draw() {
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    ctx.fillStyle = 'green';
    for (const segment of snake) {
        ctx.fillRect(segment.x * 10, segment.y * 10, 10, 10);
    }
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * 10, food.y * 10, 10, 10);
}

function setDirection(event) {
    const key = event.keyCode;
    if ([37, 38, 39, 40].includes(key)) {
        event.preventDefault();
    }
    if (key === 37 && direction.x !== 1) {   // Left arrow
        direction = { x: -1, y: 0 };
    } else if (key === 38 && direction.y !== 1) { // Up arrow
        direction = { x: 0, y: -1 };
    } else if (key === 39 && direction.x !== -1) { // Right arrow
        direction = { x: 1, y: 0 };
    } else if (key === 40 && direction.y !== -1) { // Down arrow
        direction = { x: 0, y: 1 };
    }
}

function togglePause() {
    isPaused = !isPaused;
    pauseButton.innerHTML = isPaused ? '<i class="fas fa-play"></i>' : '<i class="fas fa-pause"></i>';
}

function endGame() {
    clearInterval(interval);
    alert('Game Ended!');
    levelScreen.style.display = 'block';
    gameScreen.style.display = 'none';
    updateLevelButtons();
}

document.addEventListener('keydown', setDirection);
startButton.addEventListener('click', () => {
    startScreen.style.display = 'none';
    levelScreen.style.display = 'block';
    initializeLevels();
});
pauseButton.addEventListener('click', togglePause);
endButton.addEventListener('click', endGame);

gameCanvas.width = 400;
gameCanvas.height = 400;
