// --- 1. EFEKT LATARKI KURSORA ---
const glow = document.getElementById('glow');
document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
});

// --- 2. ANIMACJE POJAWIANIA SIĘ NA SCROLL (Intersection Observer) ---
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.hidden').forEach((el) => observer.observe(el));

// --- 3. EFEKT PISANIA NA MASZYNIE ---
const text = "Cześć, jestem Hubert.";
const typewriterElement = document.getElementById('typewriter');
let i = 0;
function typeWriter() {
    if (i < text.length) {
        typewriterElement.innerHTML += text.charAt(i);
        i++;
        setTimeout(typeWriter, 100);
    }
}
window.onload = typeWriter;

// --- 4. ZAAWANSOWANA GRA SNAKE ---
const canvas = document.getElementById("snakeCanvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("high-score");
const overlay = document.getElementById("game-overlay");
const startBtn = document.getElementById("start-btn");

const box = 20;
let score = 0;
let highScore = localStorage.getItem("snakeHighScore") || 0;
highScoreEl.innerText = `Najlepszy: ${highScore}`;

let snake, food, direction, gameInterval;
let isGameRunning = false;

// KLUCZOWE: Zapobieganie przewijaniu strony strzałkami TYLKO podczas gry
window.addEventListener("keydown", function(e) {
    if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        if(isGameRunning) {
            e.preventDefault(); 
        }
    }
}, false);

// Obsługa sterowania
document.addEventListener("keydown", (e) => {
    if (!isGameRunning) return;
    if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    else if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    else if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
    else if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
});

function initGame() {
    snake = [{ x: 9 * box, y: 10 * box }];
    food = spawnFood();
    score = 0;
    direction = "RIGHT";
    scoreEl.innerText = `Wynik: ${score}`;
    isGameRunning = true;
    overlay.style.display = "none";
    if(gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(draw, 100);
}

function spawnFood() {
    return {
        x: Math.floor(Math.random() * (canvas.width / box)) * box,
        y: Math.floor(Math.random() * (canvas.height / box)) * box
    };
}

function gameOver() {
    isGameRunning = false;
    clearInterval(gameInterval);
    if(score > highScore) {
        highScore = score;
        localStorage.setItem("snakeHighScore", highScore);
        highScoreEl.innerText = `Najlepszy: ${highScore}`;
    }
    overlay.style.display = "flex";
    overlay.querySelector("h3").innerText = "Koniec Gry!";
    startBtn.innerText = "Zagraj ponownie";
}

function draw() {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Rysowanie węża
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? "#06b6d4" : "#a1a1aa";
        ctx.beginPath();
        ctx.roundRect(snake[i].x, snake[i].y, box - 2, box - 2, 4);
        ctx.fill();
    }

    // Rysowanie jedzenia
    ctx.fillStyle = "#f43f5e";
    ctx.beginPath();
    ctx.arc(food.x + box/2 - 1, food.y + box/2 - 1, box/2 - 2, 0, Math.PI * 2);
    ctx.fill();

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === "LEFT") snakeX -= box;
    if (direction === "UP") snakeY -= box;
    if (direction === "RIGHT") snakeX += box;
    if (direction === "DOWN") snakeY += box;

    // Jedzenie
    if (snakeX === food.x && snakeY === food.y) {
        score++;
        scoreEl.innerText = `Wynik: ${score}`;
        food = spawnFood();
    } else {
        snake.pop();
    }

    let newHead = { x: snakeX, y: snakeY };

    // Detekcja kolizji (ściany lub własne ciało)
    if (snakeX < 0 || snakeX >= canvas.width || snakeY < 0 || snakeY >= canvas.height || collision(newHead, snake)) {
        return gameOver();
    }

    snake.unshift(newHead);
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) return true;
    }
    return false;
}

startBtn.addEventListener("click", initGame);