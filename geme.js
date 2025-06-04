const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let player = {
  x: 50,
  y: 100,
  width: 30,
  height: 30,
  yVelocity: 0,
  gravity: 0.6,
  jumpStrength: -12,
  onGround: false
};

let obstacles = [];
let frameCount = 0;
let gameSpeed = 4;
let score = 0;
let gameOver = false;

function resetGame() {
  obstacles = [];
  frameCount = 0;
  score = 0;
  gameOver = false;
  player.y = 100;
  player.yVelocity = 0;
  player.onGround = false;
}

function drawPlayer() {
  ctx.fillStyle = 'cyan';
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawObstacles() {
  ctx.fillStyle = 'red';
  obstacles.forEach(obs => {
    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
  });
}

function updateObstacles() {
  if (frameCount % 90 === 0) {
    // Создаем новое препятствие
    obstacles.push({
      x: canvas.width,
      y: 120,
      width: 20,
      height: 30
    });
  }
  obstacles.forEach(obs => {
    obs.x -= gameSpeed;
  });
  // Удаляем ушедшие за экран препятствия
  obstacles = obstacles.filter(obs => obs.x + obs.width > 0);
}

function checkCollision() {
  for (let obs of obstacles) {
    if (
      player.x < obs.x + obs.width &&
      player.x + player.width > obs.x &&
      player.y < obs.y + obs.height &&
      player.y + player.height > obs.y
    ) {
      gameOver = true;
    }
  }
}

function updatePlayer() {
  player.yVelocity += player.gravity;
  player.y += player.yVelocity;

  if (player.y + player.height >= canvas.height) {
    player.y = canvas.height - player.height;
    player.yVelocity = 0;
    player.onGround = true;
  } else {
    player.onGround = false;
  }
}

function gameLoop() {
  if (gameOver) {
    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.fillText('Game Over! Press Space to Restart', 50, 75);
    return;
  }
  frameCount++;
  score = Math.floor(frameCount / 10);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  updatePlayer();
  updateObstacles();
  checkCollision();

  drawPlayer();
  drawObstacles();

  ctx.fillStyle = 'white';
  ctx.font = '20px Arial';
  ctx.fillText('Score: ' + score, 10, 25);

  requestAnimationFrame(gameLoop);
}

// Управление прыжком по пробелу
window.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    if (gameOver) {
      resetGame();
      gameLoop();
    } else if (player.onGround) {
      player.yVelocity = player.jumpStrength;
    }
  }
});

// Старт игры
gameLoop();
