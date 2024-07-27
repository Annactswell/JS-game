// canvas
const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = 600;
const CANVAS_HEIGHT = canvas.height = 600;
function clearScreen() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

// 游戏帧数配置（frame: 帧）
const STAGGER_FRAMES = 10;
let gameFrames = 0;
let gameSpeed = 1;

// 精灵图
const playerImage = new Image();
playerImage.src = './Images/shadow-dog.png';
const SPRITE_WIDTH = 575;
const SPRITE_HEIGHT = 523;
 
// 背景层
const BACKGROUND_LAYER_NUM = 5;
const backgroundLayerImages = [];
for (let i = 0; i < BACKGROUND_LAYER_NUM; i++)
  backgroundLayerImages[i] = new Image();
for (let i = 0; i < BACKGROUND_LAYER_NUM; i++)
  backgroundLayerImages[i].src = `./Images/background/layer-${i + 1}.png`;

class Layer {
  constructor(image, speedModifier) {
    this.x = 0;
    this.y = 0;
    this.width = 2400;
    this.height = 700;
    this.image = image;
    this.speedModifier = speedModifier;
    this.speed = gameSpeed * this.speedModifier;
  }
  update() {
    this.speed = gameSpeed * this.speedModifier;
    if (this.x <= -this.width) this.x = 0;
    this.x = Math.floor(this.x - this.speed);
  }
  draw() {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
  }
}

// 动画种类设置
const spriteAnimations = [];
const animationStates = [
  {
    name: 'idle',
    frames: 7
  },
  {
    name: 'jump',
    frames: 7
  },
  {
    name: 'fall',
    frames: 7
  },
  {
    name: 'run',
    frames: 9
  },
  {
    name: 'dizzy',
    frames: 11
  },
  {
    name: 'sit',
    frames: 5
  },
  {
    name: 'roll',
    frames: 7
  },
  {
    name: 'bite',
    frames: 7
  },
  {
    name: 'ko',
    frames: 12
  },
  {
    name: 'getHit',
    frames: 4
  }
]
animationStates.forEach((state, i) => {
  let frames = {
    loc: []
  };
  for (let j = 0; j < state.frames; j++) {
    const positionX = j * SPRITE_WIDTH;
    const positionY = i * SPRITE_HEIGHT;
    frames.loc.push({x: positionX, y: positionY});
  }
  spriteAnimations[state.name] = frames;
});

// 人物动画播放逻辑
let playerState = 'idle';
function drawPlayer() {
  const position = spriteAnimations[playerState].loc[Math.floor(gameFrames++ / STAGGER_FRAMES) % spriteAnimations[playerState].loc.length];
  ctx.drawImage(playerImage, position.x, position.y, SPRITE_WIDTH, SPRITE_HEIGHT, 0, 0, SPRITE_WIDTH, SPRITE_HEIGHT);
  
}

// 背景动画播放逻辑
const layers = [];
const layerMoveSpeed = [0.1, 0.2, 0.3, 0.4, 0.5];
for (let i = 0; i < BACKGROUND_LAYER_NUM; i++)
  layers[i] = new Layer(backgroundLayerImages[i], layerMoveSpeed[i]);
function drawBackground() {
  layers.forEach(layer => {
    layer.update();
    layer.draw();
  });
}

// 播放动画
function animate() {
  clearScreen();

  drawBackground();
  drawPlayer();

  requestAnimationFrame(animate);
}
animate();

// 处理dom逻辑
const playerStateInput = document.querySelector('.player-state');
playerStateInput.addEventListener('change', function() {
  playerState = this.value;
})
const gameSpeedInput = document.querySelector('.game-speed .speed');
const gameSpeedSlider = document.querySelector('.game-speed .slider');
gameSpeedSlider.addEventListener('change', function(event) {
  gameSpeed = event.target.value;
})
