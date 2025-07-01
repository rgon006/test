// Game variables
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const finalScore = document.getElementById('final-score');

// Game state
let gameRunning = false;
let score = 0;
let gravity = 0.5;
let bird = {
    x: 50,
    y: canvas.height / 2,
    width: 30,
    height: 24,
    velocity: 0
};
let pipes = [];
let pipeWidth = 50;
let pipeGap = 120;
let pipeFrequency = 1500; // milliseconds
let lastPipeTime = 0;
let gameSpeed = 2;

// Event listeners
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);
canvas.addEventListener('click', () => {
    if (gameRunning) {
        bird.velocity = -10;
    }
});

// Start game function
function startGame() {
    gameRunning = true;
    score = 0;
    bird.y = canvas.height / 2;
    bird.velocity = 0;
    pipes = [];
    startScreen.style.display = 'none';
    gameOverScreen.style.display = 'none';
    lastPipeTime = Date.now();
    requestAnimationFrame(gameLoop);
}

// Game loop
function gameLoop() {
    if (!gameRunning) return;
    
    update();
    draw();
    
    requestAnimationFrame(gameLoop);
}

// Update game state
function update() {
    // Update bird
    bird.velocity += gravity;
    bird.y += bird.velocity;
    
    // Check if bird hits the ground or ceiling
    if (bird.y + bird.height > canvas.height || bird.y < 0) {
        gameOver();
    }
    
    // Generate new pipes
    const currentTime = Date.now();
    if (currentTime - lastPipeTime > pipeFrequency) {
        createPipe();
        lastPipeTime = currentTime;
    }
    
    // Update pipes
    for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].x -= gameSpeed;
        
        // Check if bird passes pipe
        if (pipes[i].x + pipeWidth < bird.x && !pipes[i].passed) {
            pipes[i].passed = true;
            score++;
        }
        
        // Check collision with pipes
        if (
            bird.x < pipes[i].x + pipeWidth &&
            bird.x + bird.width > pipes[i].x &&
            (bird.y < pipes[i].topHeight || bird.y + bird.height > pipes[i].topHeight + pipeGap)
        ) {
            gameOver();
        }
        
        // Remove pipes that are off screen
        if (pipes[i].x + pipeWidth < 0) {
            pipes.splice(i, 1);
        }
    }
}

// Draw everything
function draw() {
    // Clear canvas
    ctx.fillStyle = '#70c5ce';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw bird
    ctx.fillStyle = '#f8d347';
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
    
    // Draw pipes
    ctx.fillStyle = '#5cb85c';
    pipes.forEach(pipe => {
        // Top pipe
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.topHeight);
        // Bottom pipe
        ctx.fillRect(pipe.x, pipe.topHeight + pipeGap, pipeWidth, canvas.height - pipe.topHeight - pipeGap);
    });
    
    // Draw score
    ctx.fillStyle = '#000';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, 20, 30);
}

// Create new pipe
function createPipe() {
    const topHeight = Math.floor(Math.random() * (canvas.height - pipeGap - 100)) + 20;
    pipes.push({
        x: canvas.width,
        topHeight: topHeight,
        passed: false
    });
}

// Game over function
function gameOver() {
    gameRunning = false;
    finalScore.textContent = score;
    gameOverScreen.style.display = 'flex';
}