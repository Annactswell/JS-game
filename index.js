/** @type { HTMLCanvasElement } */ 


// Canvas2D类
class Canvas2D {
  constructor(CSS='#canvas', width=1000, height=1000) {
    this.canvas = document.querySelector(CSS);
    this.width = width;
    this.height = height;
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext('2d');

    this.key = 0;

    this.mouseX = 0;
    this.mouseY = 0;
    this.positionX = this.canvas.getBoundingClientRect().left;
    this.positionY = this.canvas.getBoundingClientRect().top;
    this.REM_IN_PIXEL = parseFloat(getComputedStyle(document.documentElement).fontSize);
    this.ratio = 1000 / (this.REM_IN_PIXEL * 9.6);
  }
  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }
  drawImage(sprite, x, y, width, height) {
    const frame = Math.floor(sprite.frame);
    this.ctx.drawImage(sprite.image, frame * sprite.width, sprite.frameY * sprite.height, sprite.width, sprite.height, x, y, width, height);
  }
  drawRect(x, y, width, height) {
    this.ctx.strokeRect(x, y, width, height);
  }
  fillRect(x, y, width, height) {
    this.ctx.fillRect(x, y, width, height);
  }
}
const canvas = new Canvas2D('#canvas', 1000, 1000);


// Sprite类
class Sprite {
  constructor(src, width, height, num=1, frameY=0, speed=GAME_FRAME) {
    this.image = new Image();
    this.image.src = src;
    this.width = width;
    this.height = height;
    this.num = num;
    this.frameY = frameY;
    this.frame = 0;
    this.speed = speed;
  }
  update() {
    this.frame += this.speed / GAME_FRAME;
    if (this.frame >= this.num) this.frame = 0;
  }
  clone() {
    return new Sprite(this.image.src, this.width, this.height, this.num, this.frameY, this.speed);
  }
}


// Player类
class Player {
  constructor(sprite, control=()=>{}, x=0, y=0, size=1, speed=10) {
    this.sprite = sprite.clone();
    
    this.control = control;
    this.x = x;
    this.y = y;
    this.size = size;
    this.speed = speed;
    this.width = this.sprite.width * this.size;
    this.height = this.sprite.height * this.size;
  }
  update() {
    this.control(this);
    this.sprite.update(); 
  }
  draw() {
    // canvas.drawRect(this.x, this.y, this.width, this.height);
    canvas.drawImage(this.sprite, this.x, this.y, this.width, this.height);
  }
  animate() {
    this.draw();
    this.update();
  }
}

const GAME_FRAME = 50;
const frames = {
  hero: 50,
  enemy: 50,
  background: 50,
  explosion: 20
}


// Sprite实例
const sprites = {
  enemy: {
    enemy1: new Sprite('./Images/enemy/enemy-1.png', 293, 155, 6, 0, frames.enemy),
    enemy2: new Sprite('./Images/enemy/enemy-2.png', 266, 188, 6, 0, frames.enemy),
    enemy3: new Sprite('./Images/enemy/enemy-3.png', 218, 177, 6, 0, frames.enemy),
    enemy4: new Sprite('./Images/enemy/enemy-4.png', 213, 213, 6, 0, frames.enemy)
  },
  hero: {
    idle:   new Sprite('./Images/hero/shadow-dog.png', 575, 523, 7,  0, frames.hero),
    jump:   new Sprite('./Images/hero/shadow-dog.png', 575, 523, 7,  1, frames.hero),
    fall:   new Sprite('./Images/hero/shadow-dog.png', 575, 523, 7,  2, frames.hero),
    run:    new Sprite('./Images/hero/shadow-dog.png', 575, 523, 9,  3, frames.hero),
    dizzy:  new Sprite('./Images/hero/shadow-dog.png', 575, 523, 11, 4, frames.hero),
    sit:    new Sprite('./Images/hero/shadow-dog.png', 575, 523, 5,  5, frames.hero),
    roll:   new Sprite('./Images/hero/shadow-dog.png', 575, 523, 7,  6, frames.hero),
    bite:   new Sprite('./Images/hero/shadow-dog.png', 575, 523, 7,  7, frames.hero),
    ko:     new Sprite('./Images/hero/shadow-dog.png', 575, 523, 12, 8, frames.hero),
    getHit: new Sprite('./Images/hero/shadow-dog.png', 575, 523, 4,  9, frames.hero)
  },
  background: {
    layer1: new Sprite('./Images/background/layer-1.png', 2400, 700, 1, 0, frames.background),
    layer2: new Sprite('./Images/background/layer-2.png', 2400, 700, 1, 0, frames.background),
    layer3: new Sprite('./Images/background/layer-3.png', 2400, 700, 1, 0, frames.background),
    layer4: new Sprite('./Images/background/layer-4.png', 2400, 700, 1, 0, frames.background),
    layer5: new Sprite('./Images/background/layer-5.png', 2400, 700, 1, 0, frames.background)
  },
  explosion: {
    explosion1: new Sprite('./Images/explosion/explosion-1.png', 200, 179, 6, 0, frames.explosion)
  }
};

// control实例
const controls = {
  hero: function(player) {
    switch (canvas.key) {
      case 'ArrowLeft':
        player.sprite = sprites.hero.run;
        player.x -= player.speed;
        break;
      case 'ArrowRight':
        player.sprite = sprites.hero.run;
        player.x += player.speed;
        break;
      case 'ArrowUp':
        player.sprite = sprites.hero.jump;
        player.y -= player.speed;
        break;
      case 'ArrowDown':
        player.sprite = sprites.hero.fall;
        player.y += player.speed;
        break;
      default:
        player.sprite = sprites.hero.run;
        break;
    }
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
  },
  enemyMove: function(player) {
    player.x -= player.speed;
    player.y += player.speed * Math.sin(player.angle);
    if (player.x + player.width < 0) player.x = canvas.width;
    if (player.x > canvas.width) player.x = -player.width;
    player.angle += 0.1 * Math.random();
  },
  backgroundMove: function(player) {
    player.x -= player.speed;
    if (player.x + player.width < 0) player.x += 2 * player.width;
  },
  explode: function(player) {
    if (player.sprite.frame >= player.sprite.num - 1)
      explosions.shift();
  }
}


// Player实例
const hero = new Player(sprites.hero.run, controls.hero, 0, canvas.height * 0.595, 0.5, 10);

let enemies = [];
for (let i = 0; i < 10; i++) {
  const sprite = sprites.enemy.enemy2;
  const control = controls.enemyMove;
  const size = Math.random() + 0.5;
  const width = sprite.width * size;
  const height = sprite.height * size;
  const x = Math.random() * (canvas.width - width);
  const y = Math.random() * (canvas.height - height);
  const speed = 5 / size;
  const enemy = new Player(sprite, control, x, y, size, speed);
  enemy.angle = Math.random() * 2;
  enemies.push(enemy);
}

const backgrounds = [];
backgrounds.push(new Player(sprites.background.layer1, controls.backgroundMove, 0, 0, canvas.height / sprites.background.layer1.height, 5));
backgrounds.push(new Player(sprites.background.layer1, controls.backgroundMove, canvas.height / sprites.background.layer1.height * sprites.background.layer1.width, 0, canvas.height / sprites.background.layer1.height, 5));
backgrounds.push(new Player(sprites.background.layer2, controls.backgroundMove, 0, 0, canvas.height / sprites.background.layer2.height, 10));
backgrounds.push(new Player(sprites.background.layer2, controls.backgroundMove, canvas.height / sprites.background.layer2.height * sprites.background.layer2.width, 0, canvas.height / sprites.background.layer2.height, 10));
backgrounds.push(new Player(sprites.background.layer3, controls.backgroundMove, 0, 0, canvas.height / sprites.background.layer3.height, 15));
backgrounds.push(new Player(sprites.background.layer3, controls.backgroundMove, canvas.height / sprites.background.layer3.height * sprites.background.layer3.width, 0, canvas.height / sprites.background.layer3.height, 15));
backgrounds.push(new Player(sprites.background.layer4, controls.backgroundMove, 0, 0, canvas.height / sprites.background.layer4.height, 20));
backgrounds.push(new Player(sprites.background.layer4, controls.backgroundMove, canvas.height / sprites.background.layer4.height * sprites.background.layer4.width, 0, canvas.height / sprites.background.layer4.height, 20));
backgrounds.push(new Player(sprites.background.layer5, controls.backgroundMove, 0, 0, canvas.height / sprites.background.layer5.height, 25));
backgrounds.push(new Player(sprites.background.layer5, controls.backgroundMove, canvas.height / sprites.background.layer5.height * sprites.background.layer5.width, 0, canvas.height / sprites.background.layer5.height, 25));

const explosions = [];
explosions.push(new Player(sprites.explosion.explosion1, controls.explode, 100, 100, 1, 1));


function animate() {
  canvas.clear();

  backgrounds.forEach(background => background.animate());
  enemies.forEach(enemy => enemy.animate());
  hero.animate();
  explosions.forEach(explosion => explosion.animate());
  
  setTimeout(() => {
    requestAnimationFrame(animate);
  }, 1000 / GAME_FRAME);
}

animate();






function heroRun() {
  document.body.addEventListener('keydown', event => canvas.key = event.key);
  document.body.addEventListener('keyup', () => canvas.key = 0);
}

// heroRun();

function clickEnemy() {
  canvas.canvas.addEventListener('click', function(event) {
    const sprite = sprites.explosion.explosion1;
    const control = controls.explode;
    const size = 1;
    const width = sprite.width * size;
    const height = sprite.height * size;
    const x = canvas.mouseX - width * 0.5;
    const y = canvas.mouseY - height * 0.5;
    explosions.push(new Player(sprite, control, x, y, size, 1));

    enemies = enemies.filter(enemy => canvas.mouseX < enemy.x || canvas.mouseX > enemy.x + enemy.width || canvas.mouseY < enemy.y || canvas.mouseY > enemy.y + enemy.height);
  });
  
  document.addEventListener('mousemove', function(event) {
    canvas.mouseX = (event.clientX - canvas.positionX) * canvas.ratio;
    canvas.mouseY = (event.clientY - canvas.positionY) * canvas.ratio;
  });
}

clickEnemy();




    


