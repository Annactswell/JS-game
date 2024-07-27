// canvas初始设置
// 宽600，高600
// 开放函数: clearCanvas()
const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = 600;
const CANVAS_HEIGHT = canvas.height = 600;
function clearCanvas() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}


// 游戏动画配置
let GAME_FRAME = 50;
let PLAYER_FRAME = 30;
let BACKGROUND_FRAME = 30;

// 人物精灵图设置
// 宽575，高523
const playerImage = new Image();
playerImage.src = './Images/shadow-dog.png';
const SPRITE_WIDTH = 575;
const SPRITE_HEIGHT = 523;
let playerFrames = 1;
 

// 动画种类设置
const spriteAnimations = [];
const playerStatesInfo = [
  { name: 'idle', frames: 7 },
  { name: 'jump', frames: 7 },
  { name: 'fall', frames: 7 },
  { name: 'run', frames: 9 },
  { name: 'dizzy', frames: 11 },
  { name: 'sit', frames: 5 },
  { name: 'roll', frames: 7 },
  { name: 'bite', frames: 7 },
  { name: 'ko', frames: 12 },
  { name: 'getHit', frames: 4 }
]
playerStatesInfo.forEach((state, i) => {
  let frames = { location: [] };
  for (let j = 0; j < state.frames; j++)
    frames.location.push({ x: j * SPRITE_WIDTH, y: i * SPRITE_HEIGHT });
  spriteAnimations[state.name] = frames;
});


// 人物动画播放逻辑
// 开放函数: drawPlayer()
let playerState = 'idle';
let playerCurrentFrame = 0;
function drawPlayer() {
  playerCurrentFrame += PLAYER_FRAME / GAME_FRAME;
  const framePositionInSprite = spriteAnimations[playerState].location[Math.floor(playerCurrentFrame) % spriteAnimations[playerState].location.length];
  ctx.drawImage(playerImage, framePositionInSprite.x, framePositionInSprite.y, SPRITE_WIDTH, SPRITE_HEIGHT, 0, 0, SPRITE_WIDTH, SPRITE_HEIGHT);
}


// 背景层图片设置
const BACKGROUND_LAYER_NUM = 5;
const backgroundLayerImages = [];
for (let i = 0; i < BACKGROUND_LAYER_NUM; i++)
  backgroundLayerImages.push(new Image());
for (let i = 0; i < backgroundLayerImages.length; i++)
  backgroundLayerImages[i].src = `./Images/background/layer-${i + 1}.png`;


// 背景层类
class Layer {
  constructor(image, speed) {
    this.x = 0;
    this.y = 0;
    this.width = 2400;
    this.height = 700;
    this.image = image;
    this.speed = speed;
  }
  update() {
    if (this.x <= -this.width) this.x = 0;
    this.x = Math.floor(this.x - BACKGROUND_FRAME / GAME_FRAME * this.speed);
  }
  draw() {
    ctx.drawImage(this.image, this.x,              this.y, this.width, this.height);
    ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
  }
}


// 背景动画播放逻辑
// 开放函数: drawBackground()
const layers = [];
const layerSpeed = [1, 2, 3, 4, 5];
for (let i = 0; i < BACKGROUND_LAYER_NUM; i++)
  layers[i] = new Layer(backgroundLayerImages[i], layerSpeed[i]);
function drawBackground() {
  layers.forEach(layer => {
    layer.update();
    layer.draw();
  });
}


// 播放动画
function startAnimate() {
  clearCanvas();

  drawBackground();
  drawPlayer();

  setTimeout(() => {
    requestAnimationFrame(startAnimate);
  }, 1000 / GAME_FRAME);
}
startAnimate();


// 处理dom逻辑
const playerStateInput = document.querySelector('.player-state');
playerStateInput.addEventListener('change', function() {
  playerState = this.value;
});
const gameSpeedSlider = document.querySelector('.game-frame .slider');
gameSpeedSlider.addEventListener('change', function(event) {
  GAME_FRAME = event.target.value;
  document.querySelector('.game-frame .frame').innerHTML = GAME_FRAME;
})

