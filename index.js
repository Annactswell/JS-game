const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

const CANVAS_WIDTH = canvas.width = 600;
const CANVAS_HEIGHT = canvas.height = 600;
const SPRITE_WIDTH = 575;
const SPRITE_HEIGHT = 523;

const playerImage = new Image();
playerImage.src = './Images/shadow-dog.png';

let frameX = 0, frameY = 3;
let gameFrame = 0;
const staggerFrames = 10;

const frameXSize = [7, 7, 7, 9, 11, 5, 7, 7, 12, 4]

let clearScreen = function() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function animate() {
  clearScreen();
  ctx.drawImage(playerImage, frameX * SPRITE_WIDTH, frameY * SPRITE_HEIGHT, SPRITE_WIDTH, SPRITE_HEIGHT, 0, 0, SPRITE_WIDTH, SPRITE_HEIGHT);
  frameX = Math.floor(gameFrame++ / staggerFrames) % frameXSize[frameY];
  requestAnimationFrame(animate);
}

animate();

const button = document.querySelector('button');
button.addEventListener('click', function() {
  frameY = document.querySelector('input').value;
})
