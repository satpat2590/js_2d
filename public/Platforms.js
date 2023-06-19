export class Platform {
  constructor({ x, y, width, height, image }) {
    this.position = {
      x: x,
      y: y,
    };
    this.image = new Image();
    this.image.src = image;
    this.width = this.image.width;
    this.height = this.image.height;
    this.checkpoints = [];
  }
  draw(ctx) {
    ctx.drawImage(  // draw the platform
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }
}

export class FloatingPlatform extends Platform {
  constructor({ x, y, width, height, image, sx, sy, swidth, sheight }) {
    super({ x, y, width, height, image });
    this.sx = sx;
    this.sy = sy;
    this.swidth = swidth;
    this.sheight = sheight;
    this.width = width;
    this.height = height;
  }
  draw(ctx) { // draw the floating platform
    ctx.drawImage(
      this.image,
      this.sx,
      this.sy,
      this.swidth,
      this.sheight,
      this.position.x,
      this.position.y,
      this.swidth,
      this.sheight
    );
  }
}

export class RespawnCheckpoint extends Platform {
  constructor({ x, y, width, height, image, checkpointID, xf }) {
    super({ x, y, width, height, image });
    this.checkpointID = checkpointID; // checkpointID is the number of the checkpoint
    this.width = 100; // width of the checkpoint
    this.height = 100;  // height of the checkpoint
    this.xf = xf; // xf is the x position of the checkpoint
  }
  update() {  // update the checkpoint
    super.update();
  }
  draw(ctx) { // draw the checkpoint
    super.draw(ctx);    
  }
}

export function floorcreation(multiplePlatforms) {
  let numberOfPlatforms = 3;
  // creates the floors with the for loops
  for (let i = 0; i < numberOfPlatforms; i++) {
    const platformX = i * 575;
    const platform = new Platform({
      x: platformX,
      y: 490,
      image: "./assets/img/platform.png",
    });
    multiplePlatforms.push(platform);
  }

  for (let i = 0; i < numberOfPlatforms; i++) {
    const platformX = 2300 + i * 575;
    const newPlatform = new Platform({
      x: platformX,
      y: 490,
      image: "./assets/img/platform.png",
    });
    multiplePlatforms.push(newPlatform);
  }

  for (let i = 0; i < numberOfPlatforms; i++) {
    const platformX = 5100 + i * 575;
    const newPlatform = new Platform({
      x: platformX,
      y: 490,
      image: "./assets/img/platform.png",
    });
    multiplePlatforms.push(newPlatform);
  }

  for (let i = 0; i < numberOfPlatforms; i++) {
    const platformX = 7900 + i * 575;
    const newPlatform = new Platform({
      x: platformX,
      y: 490,
      image: "./assets/img/platform.png",
    });
    multiplePlatforms.push(newPlatform);
  }

  multiplePlatforms.push(
    new FloatingPlatform({
      x: 1780,
      y: 300,
      image: "./assets/img/platformcave.png",
      sx: 274,
      sy: 643,
      sheight: 64,
      swidth: 304,
      width: 304,
      height: 64,
    }),
    new FloatingPlatform({
      x: 4050,
      y: 350,
      image: "./assets/img/platformcave.png",
      sx: 274,
      sy: 643,
      sheight: 64,
      swidth: 100,
      width: 100,
      height: 64,
    }),
    new FloatingPlatform({
      x: 4230,
      y: 225,
      image: "./assets/img/platformcave.png",
      sx: 274,
      sy: 643,
      sheight: 64,
      swidth: 100,
      width: 100,
      height: 64,
    }),
    new FloatingPlatform({
      x: 4410,
      y: 100,
      image: "./assets/img/platformcave.png",
      sx: 274,
      sy: 643,
      sheight: 64,
      swidth: 100,
      width: 100,
      height: 64,
    }),
    new FloatingPlatform({
      x: 4590,
      y: 225,
      image: "./assets/img/platformcave.png",
      sx: 274,
      sy: 643,
      sheight: 64,
      swidth: 120,
      width: 120,
      height: 64,
    }),
    new FloatingPlatform({
      x: 4900,
      y: 300,
      image: "./assets/img/platformcave.png",
      sx: 274,
      sy: 643,
      sheight: 64,
      swidth: 304,
      width: 304,
      height: 64,
    }),
    new FloatingPlatform({
      x: 6875,
      y: 350,
      image: "./assets/img/platformcave.png",
      sx: 274,
      sy: 643,
      sheight: 64,
      swidth: 110,
      width: 110,
      height: 64,
    }),
    new FloatingPlatform({
      x: 7030,
      y: 225,
      image: "./assets/img/platformcave.png",
      sx: 274,
      sy: 643,
      sheight: 64,
      swidth: 110,
      width: 110,
      height: 64,
    }),
    new FloatingPlatform({
      x: 7185,
      y: 150,
      image: "./assets/img/platformcave.png",
      sx: 274,
      sy: 643,
      sheight: 64,
      swidth: 304,
      width: 304,
      height: 64,
    }),
    new FloatingPlatform({
      x: 7340,
      y: 150,
      image: "./assets/img/platformcave.png",
      sx: 274,
      sy: 643,
      sheight: 64,
      swidth: 304,
      width: 304,
      height: 64,
    }),
    new RespawnCheckpoint({
      x: 2850,
      y: 390,
      image: "./assets/img/idle.png",
      checkpointID: 2,
      xf: 2850,
    }),
    new RespawnCheckpoint({
      x: 5900,
      y: 390,
      image: "./assets/img/idle.png",
      checkpointID: 3,
      xf: 5900,
    }),
    new RespawnCheckpoint({
      x: 7900,
      y: 390,
      image: "./assets/img/idle.png",
      checkpointID: 4,
      xf: 7900,
    })
  );
  return multiplePlatforms; //returns an array of platforms
}