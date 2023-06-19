import { Hero, spriteCharacters, Slime } from "./Sprite.js";
import {
  Platform,
  FloatingPlatform,
  floorcreation,
  RespawnCheckpoint,
} from "./Platforms.js";
import { InputHandler } from "./InputHandler.js";

let multiplePlatforms = []; // array of platforms 
const canvas = document.getElementById("canvas1");  // get the canvas
const ctx = canvas.getContext("2d");  // get the context
const canvasWidth = (canvas.width = 900); // set the canvas width
const canvasHeight = (canvas.height = 600); // set the canvas height
let gameFrame = 0;  // game frame
const gravity = 1.5;
const mainMenu = document.getElementById("main-menu");
const startBtn = document.getElementById("start-btn");
const mini_characters = document.querySelectorAll(".sprites");
let selectedCharacter = null;

mini_characters.forEach((character) => {  // add event listener to the characters
  character.addEventListener("click", () => {
    if (selectedCharacter) {
      selectedCharacter.classList.remove("selected");
    }
    selectedCharacter = character;  // set the selected character
    selectedCharacter.classList.add("selected");  // add the selected class to the selected character
  });
});

const background1 = new Image();  // create a new image
background1.src = "./assets/glacialmountains/background_glacial_mountains.png"; // set the source of the image

class Game {  // game class
  constructor({ width, height, character, platforms, enemies }) {
    this.input = new InputHandler();
    this.height = height;
    this.width = width;
    this.platforms = platforms;
    this.enemies = [];
    this.prevGame = this;
    this.globalPos = 50;
    this.globalPosCheck = 50;
    this.player = new Hero({
      position: {
        x: 250,
        y: 50,
      },
      game: this,
      character: character,
    });
    this.enemy = enemies;
  }
  update(ctx, canvas) { // update the game
    this.enemies.forEach((enemy) => {
      enemy.update(ctx, canvas);
    });

    this.player.update(ctx, canvas, this.input.keys, multiplePlatforms);  // update the player
    gameFrame++;

    if (this.input.keys.includes("ArrowRight") && !this.player.collide) {   // if the right arrow key is pressed and the player is not colliding
      this.globalPosCheck += 5;   // shift the world
    } else if (this.input.keys.includes("ArrowLeft") && !this.player.collide) { // if the left arrow key is pressed and the player is not colliding
      this.globalPosCheck -= 5;   // shift the world
    }
    if (this.player.position.y > canvas.height) {
      init(); // restart the game
    }

    this.player.collisionDetection(); // check for collision
  }

  draw(ctx) {
    this.platforms.forEach((platform) => {  // draw the platforms
      platform.draw(ctx);
    });
    this.player.draw(ctx);
  }

  shiftWorld(dx) {  // shift the world
    this.platforms.forEach(platform => {
      platform.position.x += dx;  // shift the platforms
    });
  
    // Also shift enemies
    this.enemies.forEach(enemy => {   // shift the enemies
      enemy.position.x += dx;   // shift the enemies
    });
    this.globalPosCheck -= dx;    // shift the world
  }
}

floorcreation(multiplePlatforms); // create the floor

let game;
startBtn.addEventListener("click", () => {
  if (!selectedCharacter) {
    alert("Please select a character before starting the game."); // if no character is selected, alert the user
    return;
  }

  mainMenu.style.display = "none";  // hide the main menu
  game = new Game({ // create a new game
    width: canvas.width,
    height: canvas.height,
    character: selectedCharacter.id,
    platforms: multiplePlatforms,
  });

  game.enemies = [  // create the enemies
    new Slime({
      position: {
        x: 500,
        y: 0,
      },
      game: game,
    }),
    new Slime({
      position: {
        x: 2600,
        y: 0,
      },
      game: game,
    }),
    new Slime({
      position: {
        x: 4600,
        y: 0,
      },
      game: game,
    }),
  ];

  animate(0); // Start the game
});

class Layer { // layer class
  constructor({ image, speedModifier, y, background }) {
    this.image = new Image();
    this.image.src = image;
    this.speedModifier = speedModifier;
    this.x = 0;
    this.y = y;
    this.width = canvas.width;
    this.height = canvas.height;
    this.x2 = this.width;
    this.speed = 3 * this.speedModifier;
    this.background = background;
    this.x3 = -this.width;
  }

  update() {  // update the layer
    if (this.x <= -this.width) this.x = this.width + this.x2 - this.speed;
    if (this.x2 <= -this.width) this.x2 = this.width + this.x - this.speed;
    if (this.x3 <= -this.width * 2) this.x3 = this.x - this.speed;
    if (!this.background) {
      this.x = Math.floor(this.x - this.speed);
      this.x2 = Math.floor(this.x2 - this.speed);
      this.x3 = Math.floor(this.x3 - this.speed);
    } else if (
      game.input.keys.includes("ArrowRight") &&
      !game.player.collide &&
      this.background === true
    ) {
      this.x = Math.floor(this.x - this.speed);
      this.x2 = Math.floor(this.x2 - this.speed);
      this.x3 = Math.floor(this.x3 - this.speed);
    } else if (
      game.input.keys.includes("ArrowLeft") &&
      !game.player.collide &&
      this.background === true
    ) {
      this.x = Math.ceil(this.x + this.speed);
      this.x2 = Math.ceil(this.x2 + this.speed);
      this.x3 = Math.ceil(this.x3 + this.speed);
    }
    this.draw();
  }

  draw() {
    ctx.drawImage(this.image, this.x3, this.y, this.width, this.height);
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    ctx.drawImage(this.image, this.x2, this.y, this.width, this.height);
  }

  shiftBack(amountTakeback) { // shift the layer back
    this.x = this.x + (amountTakeback % 625) - game.player.position.x;
    this.x2 = this.x2 + (amountTakeback % 625) - game.player.position.x;
    this.x3 = this.x3 + (amountTakeback % 625) - game.player.position.x;
  }
}

const layer1 = new Layer({  // create the layers
  image: "./assets/glacialmountains/background_glacial_mountains.png",
  speedModifier: 0.1,
  y: 0,
  background: true,
});

const layer2 = new Layer({  // create the layers
  image: "./assets/glacialmountains/Layers/cloud_lonely.png",
  speedModifier: 0.4,
  y: 0,
  background: false,
});

const layer3 = new Layer({  // create the layers
  image: "./assets/glacialmountains/Layers/clouds_mg_1_lightened.png",
  speedModifier: 0.6,
  y: -50,
  background: false,
});

// floorcreation(multiplePlatforms); // create the floor

let checkpointplatforms = [];
let checkers = [];
let currentPlayerPosition = [];

function init() {
  multiplePlatforms = []; // reset the platforms
  checkpointplatforms = []; // reset the checkpoints
  checkers = [];  // reset the checkers
  currentPlayerPosition = [];
  let playerRespawn = 500;
  let scrollBack = game.globalPosCheck - 500;

  floorcreation(multiplePlatforms); // create the floor
  checkpointplatforms = multiplePlatforms
    .filter((platform) => platform instanceof RespawnCheckpoint)
    .map((platform) => platform); // create the checkpoints

  for (const checkpoint of checkpointplatforms) {
    if (game.globalPosCheck > checkpoint.xf) {
      scrollBack = game.globalPosCheck - checkpoint.xf; // scrollback amount
      playerRespawn = checkpoint.xf;  // player respawn position
    }
  }

  game.globalPosCheck = playerRespawn; // scrollback amount

  game.player = new Hero({
    position: {
      x: 250,
      y: 390,
    },
    character: selectedCharacter.id,
    game: game,
  });

  game.platforms.forEach((platform) => {
    platform.position.x += scrollBack;
  });
}

let start = null;

function animate(timeStamp) {

  if (!start) {
    start = Date.now();
  }

  if (gameFrame % 600 === 0) 

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  layer1.update();  // update the layers
  layer2.update();  // update the layers
  layer3.update();  // update the layers

  game.platforms.forEach((platform) => {
    platform.draw(ctx);
  });

  game.update(ctx, canvas); // update the game
  game.draw(ctx); // draw the game
  if (
    game.globalPosCheck === multiplePlatforms[multiplePlatforms.length - 1].xf
  ) {
    const end = Date.now(); // end the game
    const elapsed = (end - start) / 1000;
    alert("You finished the game in " + elapsed + " seconds!"); // alert the time
    start = 0;
  } 
  requestAnimationFrame(animate); // request animation frame
}

animate(0); // start the game