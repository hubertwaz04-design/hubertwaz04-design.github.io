// 1. KOLOROWY KURSOR
const follower = document.getElementById('cursor-follower');
document.addEventListener('mousemove', (e) => {
    follower.style.left = e.pageX + 'px';
    follower.style.top = e.pageY + 'px';
});

// 2. MINI SNAKE
const canvas = document.getElementById('snakeCanvas');
const ctx = canvas.getContext('2d');
let snake = [{x: 10, y: 10}];
let food = {x: 15, y: 15};
let dx = 0, dy = 0;

document.addEventListener('keydown', (e) => {
    if(e.key === 'ArrowUp') { dx = 0; dy = -1; }
    if(e.key === 'ArrowDown') { dx = 0; dy = 1; }
    if(e.key === 'ArrowLeft') { dx = -1; dy = 0; }
    if(e.key === 'ArrowRight') { dx = 1; dy = 0; }
});

function drawGame() {
    let head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);
    if(head.x === food.x && head.y === food.y) {
        food = {x: Math.floor(Math.random()*15), y: Math.floor(Math.random()*15)};
    } else { snake.pop(); }
    
    ctx.fillStyle = 'black'; ctx.fillRect(0,0,300,300);
    ctx.fillStyle = 'lime'; snake.forEach(p => ctx.fillRect(p.x*20, p.y*20, 18, 18));
    ctx.fillStyle = 'red'; ctx.fillRect(food.x*20, food.y*20, 18, 18);
    setTimeout(drawGame, 100);
}
drawGame();

// 3. FAJERWERKI (Uproszczone)
const fCanvas = document.getElementById('fireworksCanvas');
const fCtx = fCanvas.getContext('2d');
fCanvas.width = window.innerWidth; fCanvas.height = window.innerHeight;

function createFirework() {
    fCtx.fillStyle = `hsl(${Math.random()*360}, 100%, 50%)`;
    fCtx.beginPath();
    fCtx.arc(Math.random()*fCanvas.width, Math.random()*fCanvas.height, 5, 0, Math.PI*2);
    fCtx.fill();
}
setInterval(() => {
    fCtx.clearRect(0,0,fCanvas.width, fCanvas.height);
    for(let i=0; i<10; i++) createFirework();
}, 200);