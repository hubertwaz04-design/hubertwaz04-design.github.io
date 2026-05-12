const canvas = document.getElementById("snakeCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");

const box = 20;
let score = 0;
let snake = [{ x: 9 * box, y: 10 * box }];
let food = { x: Math.floor(Math.random() * 19 + 1) * box, y: Math.floor(Math.random() * 19 + 1) * box };
let d = "RIGHT";

document.addEventListener("keydown", direction);

function direction(event) {
    if (event.keyCode == 37 && d != "RIGHT") d = "LEFT";
    else if (event.keyCode == 38 && d != "DOWN") d = "UP";
    else if (event.keyCode == 39 && d != "LEFT") d = "RIGHT";
    else if (event.keyCode == 40 && d != "UP") d = "DOWN";
}

function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i == 0 ? "#38bdf8" : "white";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = "#ef4444";
    ctx.fillRect(food.x, food.y, box, box);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (d == "LEFT") snakeX -= box;
    if (d == "UP") snakeY -= box;
    if (d == "RIGHT") snakeX += box;
    if (d == "DOWN") snakeY += box;

    if (snakeX == food.x && snakeY == food.y) {
        score++;
        scoreElement.innerHTML = "Wynik: " + score;
        food = { x: Math.floor(Math.random() * 19 + 1) * box, y: Math.floor(Math.random() * 19 + 1) * box };
    } else {
        snake.pop();
    }

    let newHead = { x: snakeX, y: snakeY };

    if (snakeX < 0 || snakeX >= canvas.width || snakeY < 0 || snakeY >= canvas.height || collision(newHead, snake)) {
        clearInterval(game);
        alert("Koniec gry! Twój wynik: " + score);
        location.reload();
    }

    snake.unshift(newHead);
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x == array[i].x && head.y == array[i].y) return true;
    }
    return false;
}

function resetGame() { location.reload(); }

let game = setInterval(draw, 100);