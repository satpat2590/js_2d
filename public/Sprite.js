export const spriteCharacters = {
  characters: {
    maskDude: "./assets/gamedesign/main-characters/mask-dude/",
    ninjaFrog: "./assets/gamedesign/main-characters/ninja-frog/",
    pinkMan: "./assets/gamedesign/main-characters/pink-man/",
    virtualGuy: "./assets/gamedesign/main-characters/virtual-guy/",
  },  // set the characters
  moveSet: {
    idle: { url: "idle.png", frames: 11 },
    run: { url: "run.png", frames: 12 },
    jump: { url: "jump.png", frames: 1 },
    hit: { url: "hit.png", frames: 7 },
    wall_jump: { url: "wall-jump.png", frames: 5 },
    fall: { url: "fall.png", frames: 1 },
  },    // set the moveset
};

export const enemyCharacters = {
  enemies: {
    slimes: {
      "hit.png": 5,
      "idle.png": 10,
      "particles.png": 4,
    },
  },
};  // set the enemies

const gravity = 1.5;  // set the gravity

export class Sprite { // sprite class
  constructor({ position, image, height, width, character, action, game }) {
    this.position = position;
    this.image = new Image();
    this.image.src = image;
    this.width = width;
    this.height = height;
    this.character = character;
    this.action = action;
    this.canJump = true;
    this.moving = false;
    this.collide = false;
    this.edge = {
      left: false,
      right: false,
    };
    this.game = game;
    this.isInvincible = false;
    this.isDead = false;
    this.lastPosition = {
      x: 0,
      y: 0,
    };
  }
  draw() {
    if (!this.image) {
      return;
    }
    ctx.drawImage(this.image, this.position.x, this.position.y);
  }
  update() {
    this.draw();
  }

  isPlayerOnPlatform(canvas) {    // check if the player is on a platform
    if (this.position.y + this.height > canvas.height) {
      this.action = "idle";
      this.image.src =
        spriteCharacters.characters[this.character] +
        spriteCharacters.moveSet[this.action].url;
      return true;
    }
    for (let i = 0; i < this.game.platforms.length; i++) {
      const platform = this.game.platforms[i];
      if (
        this.position.y + this.height === platform.position.y &&
        this.position.x + this.width > platform.position.x &&
        this.position.x < platform.position.x + platform.width
      ) {
        this.action = "idle";
        this.image.src =
          spriteCharacters.characters[this.character] +
          spriteCharacters.moveSet[this.action].url;
        return true;
      }
    }
    return false; // if the player is not on a platform
  }

  collisionDetection() {  // check for collision
    this.collide = false;
    this.game.platforms.forEach((platform) => {
      // Check for collision from above
      if (
        this.position.y + this.height <= platform.position.y &&
        this.position.y + this.height + this.velocity.y >=
          platform.position.y &&
        this.position.x + this.width >= platform.position.x &&
        this.position.x <= platform.position.x + platform.width
      ) {
        this.velocity.y = 0;
        this.position.y = platform.position.y - this.height;
        this.canJump = true;
      }

      // Check for collision from below
      if (
        this.position.y >= platform.position.y + platform.height &&
        this.position.y + this.velocity.y <=
          platform.position.y + platform.height &&
        this.position.x + this.width >= platform.position.x &&
        this.position.x <= platform.position.x + platform.width
      ) {
        this.velocity.y = 0;
        this.position.y = platform.position.y + platform.height;
      }

      // Check for collision from the left
      if (
        this.position.x + this.width <= platform.position.x &&
        this.position.x + this.width + this.velocity.x >= platform.position.x &&
        this.position.y + this.height > platform.position.y &&
        this.position.y < platform.position.y + platform.height
      ) {
        this.velocity.x = 0;
        this.position.x = platform.position.x - this.width;
        this.collide = true;
      }

      // Check for collision from the right
      if (
        this.position.x >= platform.position.x + platform.width &&
        this.position.x + this.velocity.x <=
          platform.position.x + platform.width &&
        this.position.y + this.height > platform.position.y &&
        this.position.y < platform.position.y + platform.height
      ) {
        this.velocity.x = 0;
        this.position.x = platform.position.x + platform.width;
        this.collide = true;
      }
    });
  }
  checkCollisionWithEnemies() { // check for collision with enemies
    this.game.enemies.forEach((enemy, index) => {
      // Check for collision
      if (
        this.position.x < enemy.position.x + enemy.width &&
        this.position.x + this.width > enemy.position.x &&
        this.position.y < enemy.position.y + enemy.height &&
        this.position.y + this.height > enemy.position.y
      ) {
        // Check if the hero was above the enemy in the last frame
        if (this.lastPosition.y + this.height <= enemy.position.y) {
          this.game.enemies.splice(index, 1);
        } else {
          this.takeDamage();
        }
      }
    });
  }

  takeDamage() {
    this.isInvincible = true;

    if (this.lives <= 0) {
      this.isDead = true;
    } else {
      this.velocity.y = -20;
      this.game.shiftWorld(150);
      setTimeout(() => {
        this.isInvincible = false;
      }, 2000); 
    }
  }
}

export class Hero extends Sprite {
  constructor({ position, character, action, game }) {
    super({ position, character, action, game });
    this.character = character;
    this.action = "idle";
    this.image.src =
      spriteCharacters.characters[this.character] +
      spriteCharacters.moveSet[this.action].url;
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.width = 65;
    this.height = 65;
    this.speed = 0.9;
    this.moving = false;
    this.canJump = true;
    this.frame = 0;
    this.game = game;
  }
  update(ctx, canvas) {
    this.lastPosition = { ...this.position }; // Save last position
    this.position.y += this.velocity.y;
    this.position.x += this.velocity.x;
    this.edge = {
      left: false,
      right: false,
    };

    if (this.game.input.keys.includes("ArrowUp") || this.game.input.keys.includes("w")) {
      if (
        this.canJump &&
        this.isPlayerOnPlatform(this.game.platforms, canvas)
      ) {
        // Check if the player is on a platform
        this.moving = true;
        this.canJump = false;
      }
    }
    if (this.moving && this.position.y > 0) {
      this.velocity.y = -25; 
      this.action = "jump";
      this.moving = false; 
    }

    if (this.position.y + this.height + this.velocity.y <= canvas.height) {
      this.velocity.y += gravity;
    }

    this.frame =
      (this.frame + 1) % spriteCharacters.moveSet[this.action].frames; 
    this.draw(ctx);

    if (this.game.input.keys.includes("ArrowRight") || this.game.input.keys.includes("d")) {
      if (!this.collide) {
        this.game.globalPos += 5;
      }
      if (this.canJump) {
        this.action = "run";
        this.image.src =
          spriteCharacters.characters[this.character] +
          spriteCharacters.moveSet[this.action].url;
      }

      this.game.platforms.forEach((platform) => {
        platform.position.x -= 5;
      });

      this.game.enemies.forEach((enemy) => {
        enemy.position.x -= 5;
      });
    } else if (this.game.input.keys.includes("ArrowLeft") || this.game.input.keys.includes("a")) {
      if (!this.collide) {
        this.game.globalPos -= 5;
      }

      this.game.platforms.forEach((platform) => {
        platform.position.x += 5;
      });

      this.game.enemies.forEach((enemy) => {
        enemy.position.x += 5;
      });
    } else if (this.game.input.keys.includes("ArrowDown") || this.game.input.keys.includes("s")) {
      this.velocity.x = 0;
    } else {
      this.velocity.x = 0;
    }

    if (!(this.game.input.keys.includes("ArrowRight") || this.game.input.keys.includes("d"))) {
      this.action = "idle";
      this.image.src =
        spriteCharacters.characters[this.character] +
        spriteCharacters.moveSet[this.action].url;
    }

    this.checkCollisionWithEnemies();
  }
  draw(ctx) {
    const spriteSize = 32; 
    const sx = this.frame * spriteSize; 
    const sy = 0; 
    ctx.drawImage(
      this.image,
      sx,
      sy,
      spriteSize,
      spriteSize,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }
}

export class Enemy extends Sprite {   // Enemy class
  constructor({ position, image, action, player, game }) {
    super({ position, image, action, game });
    this.action = "idle.png";
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.width = 44;
    this.height = 30;
    this.directory = "";
    this.player = player;
    this.lastAttack = Date.now();
    this.frameX = 0;
    this.frameY = 0;
    this.game = game;
    this.gameFrame = 0;
    this.frameStagger = 5;
  }

  update(ctx, canvas) {}

  draw(ctx) {
    this.frameX =
      Math.floor(this.gameFrame / this.frameStagger) %
      enemyCharacters.enemies.slimes[this.action]; 

    ctx.drawImage(
      this.image,
      this.frameX * this.width,
      this.frameY * this.height,
      48,
      32,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  checkCollisionWithHero() {
    // Check for collision
    if (
      this.position.x < this.game.player.position.x + this.game.player.width &&
      this.position.x + this.width > this.game.player.position.x &&
      this.position.y < this.game.player.position.y + this.game.player.height &&
      this.position.y + this.height > this.game.player.position.y
    ) {
      if (this.position.x < this.game.player.position.x) {
        this.position.x = this.game.player.position.x - this.width;
      } else {
        this.position.x = this.game.player.position.x + this.game.player.width;
      }
    }
  }
}

export class Slime extends Enemy {  // Slime class
  constructor({ position, game }) {
    super({ position, game });
    this.directory = "./assets/Enemies/Slime/";
    this.action = "idle.png";
    this.image = new Image();
    this.image.src = this.directory + this.action;
    this.width = 60;
    this.height = 30;
    this.rwidth = 44;
    this.rheight = 30;
    this.frameStagger = 5;
  }

  update(ctx, canvas) {
    super.update(ctx, canvas);
    this.velocity.x = 0;

    if (Math.abs(this.game.player.position.x - this.position.x) <= 1000) {
      this.action = "idle.png";
      this.image.src = this.directory + this.action;
      if (this.game.player.position.x < this.position.x) {
        this.velocity.x = -1;
      } else {
        this.velocity.x = 1;
      }
    }
    if (this.position.y + this.height + this.velocity.y <= canvas.height) {
      this.velocity.y += gravity;
    }

    this.gameFrame++;

    this.collisionDetection();
    this.checkCollisionWithHero();
    this.draw(ctx);
  }

  draw(ctx) {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    if (this.action === "hit.png" && this.frameX === 4) {
      this.action = "idle.png";
      this.image.src = this.directory + this.action;
      this.frameStagger = 5;
    }
    this.frameX =
      Math.floor(this.gameFrame / this.frameStagger) %
      enemyCharacters.enemies.slimes[this.action]; // update the frame number

    ctx.drawImage(
      this.image,
      this.frameX * this.rwidth,
      this.frameY * this.rheight,
      48,
      32,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }
}