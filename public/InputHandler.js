export class InputHandler {
  constructor() {
      this.keys = []; // array of keys pressed
      // add event listeners for keydown and keyup
      window.addEventListener("keydown", (e) => {
            if ((
              e.key === "ArrowRight" || e.key === "d" ||
              e.key === "ArrowLeft" || e.key === "a" ||
              e.key === "ArrowUp" || e.key === "w" || 
              e.key === "ArrowDown" || e.key === "s"
            ) && this.keys.indexOf(e.key) === -1) {
              this.keys.push(e.key);
            } 
          },
          false
      );
        
      window.addEventListener("keyup", (e) => {
            if ((e.key === "ArrowRight" || e.key === "d" ||
                e.key === "ArrowLeft" || e.key === "a" ||
                e.key === "ArrowUp" || e.key === "w" ||
                e.key === "ArrowDown" || e.key === "s"
             ) && this.keys.indexOf(e.key) !== -1) {
              this.keys.splice(this.keys.indexOf(e.key), 1);
             } 
          },
          false
      );
  }
}