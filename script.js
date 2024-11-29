// script.js

// Canvas setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;

// Assets (replace with your own images)
const sawImage = new Image();
sawImage.src = "assets/saw.png";

const playerImage = new Image();
playerImage.src = "assets/player.png";

const goalImage = new Image();
goalImage.src = "assets/bandage.png";

// Game variables
const gravity = 0.8;
const friction = 0.8;

let player = {
    x: 50,
    y: 500,
    width: 20,
    height: 20,
    dx: 0,
    dy: 0,
    speed: 5,
    jumpPower: -15,
    grounded: false,
    wallSliding: false,
};

const goal = { x: 750, y: 520, width: 30, height: 30 };

// Platforms and hazards
const platforms = [
    { x: 0, y: 580, width: 800, height: 20 },
    { x: 300, y: 450, width: 100, height: 20 },
    { x: 500, y: 350, width: 150, height: 20 },
];

const saws = [
    { x: 400, y: 550, radius: 15 },
    { x: 600, y: 330, radius: 15 },
];

// Key handling
const keys = {};
window.addEventListener("keydown", (e) => (keys[e.code] = true));
window.addEventListener("keyup", (e) => (keys[e.code] = false));

// Collision Detection
function checkCollision(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}

// Game Loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Player Movement
    if (keys["ArrowLeft"]) player.dx = -player.speed;
    if (keys["ArrowRight"]) player.dx = player.speed;

    // Jumping
    if (keys["ArrowUp"] && player.grounded) {
        player.dy = player.jumpPower;
        player.grounded = false;
    }

    // Apply gravity and friction
    player.dy += gravity;
    player.dx *= friction;

    // Update player position
    player.x += player.dx;
    player.y += player.dy;

    // Platform collisions
    player.grounded = false;
    for (const platform of platforms) {
        if (
            player.x < platform.x + platform.width &&
            player.x + player.width > platform.x &&
            player.y + player.height < platform.y &&
            player.y + player.height + player.dy >= platform.y
        ) {
            player.grounded = true;
            player.dy = 0;
            player.y = platform.y - player.height;
        }
    }

    // Hazard collisions
    for (const saw of saws) {
        const dx = player.x + player.width / 2 - (saw.x + saw.radius);
        const dy = player.y + player.height / 2 - (saw.y + saw.radius);
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < saw.radius + player.width / 2) {
            resetPlayer();
        }
    }

    // Goal collision
    if (checkCollision(player, goal)) {
        alert("You win!");
        resetPlayer();
    }

    // Prevent leaving screen bounds
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;

    // Draw platforms
    ctx.fillStyle = "gray";
    platforms.forEach((platform) =>
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height)
    );

    // Draw hazards
    saws.forEach((saw) => {
        ctx.drawImage(sawImage, saw.x, saw.y, saw.radius * 2, saw.radius * 2);
    });

    // Draw player
    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);

    // Draw goal
    ctx.drawImage(goalImage, goal.x, goal.y, goal.width, goal.height);

    requestAnimationFrame(gameLoop);
}

// Reset Player
function resetPlayer() {
    player.x = 50;
    player.y = 500;
    player.dx = 0;
    player.dy = 0;
}

gameLoop();
