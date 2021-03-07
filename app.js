const cvs = document.getElementById("canvas");
const ctx = cvs.getContext("2d");
// CREATING GRID 
const scale = 20;
const rows = cvs.height / scale;
const columns = cvs.width / scale;

// AUDIOS 
const startTune = new Audio("soundeffects/start.mp3");
const fruitPop = new Audio("soundeffects/fruitpop.mp3");
const gameOverTune = new Audio("soundeffects/dundundun.mp3");

// ~~~~~GAME STATE HANDLING~~~~~
let gameState; 
const startMenu = document.getElementById("start-menu")
const gameOverMenu = document.getElementById("game-over");
// const pauseMenu = document.getElementById("pause");

setState("start");
// INITIALISING SNAKE 
// (is in extra brackets to be called straight away)
(function initSnake() {

    snake = new Snake();
    fruit = new Fruit();

    fruit.randomLocation();
    
    let speed = window.setInterval(() => {
        if (gameState === "play") {
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        snake.update();
        fruit.draw();
        snake.draw();
        }
        
        if (snake.eat(fruit)) {
            fruit.randomLocation();
            fruitPop.play();
        }

        snake.checkForCollision();
        document.querySelector("#score").innerText = snake.totalFruit;
        
    }, 180); /* snake is created, moved, and cleared every 180 */

}());

// CONTROL 
document.body.onkeyup = function(e) {
    if(e.keyCode == 32) {
        restart();
    }
}

window.addEventListener("keydown", ((e) => {
    const direction = e.key.replace("Arrow", "");
snake.changeDirection(direction);
}));

// ~~~~~~ OBJECT SNAKE ~~~~~~
// initial positioning and speed
function Snake() {

    this.x = 0;
    this.y = 0;
    this.xSpeed = scale* 1;
    this.ySpeed = 0;
    this.totalFruit = 0;
    this.tail = [];
    
    // design of snake 
    this.draw = function() {

          for (let i = 0; i < this.tail.length; i++) {
            ctx.fillRect(this.tail[i].x, this.tail[i].y, scale, scale);
        };

        ctx.fillRect(this.x, this.y, scale, scale); /*creates square*/
        ctx.fillStyle = "#5300E2";

     };

  // increments snake position 
    this.update = function() {
    for(let i = 0; i < this.tail.length - 1; i++) {
    this.tail[i] = this.tail[i+1];
    }
    this.tail[this.totalFruit - 1] = { x: this.x, y: this.y }; 

 //  SETTING BORDER BOUNDARIES 
        this.x += this.xSpeed;
        this.y += this.ySpeed;
    
        if(this.x > cvs.width) {
            setState("gameover")
        }
        if(this.x < 0) {
            setState("gameover")
        }
        if(this.y > cvs.height) {
            setState("gameover")
        }
        if(this.y < 0) {
            setState("gameover")
        }
    }
 
    // ASSIGNING KEY DIRECTION 
    this.changeDirection = function(direction) {
        switch(direction) {
            case "Up":
                if(!this.ySpeed >0) {
                this.xSpeed = 0;
                this.ySpeed = -scale * 1;
            }
                break;
                case "Down":
                    if (!this.ySpeed >0) {
                    this.xSpeed = 0;
                    this.ySpeed = scale * 1;
                }
                    break;
                    case "Left":
                        if (!this.xSpeed >0) {
                        this.xSpeed = -scale * 1;
                        this.ySpeed = 0;
                        }
                        break;
                        case "Right":
                            if (!this.xSpeed >0) {
                            this.xSpeed = scale * 1;
                            this.ySpeed = 0;
                            }
                            break;
        }
    };

      // SNAKE EATING THE FRUIT 
    this.eat = function(fruit) {
        if (this.x === fruit.x && this.y === fruit.y) {
        this.totalFruit++;
            return true;
        }
        return false;
    };
    
    // IF SNAKE COLLIDES WITH ITSELF
    this.checkForCollision = function() {
        for (var i=0; i < this.tail.length; i++) {
            if(this.x === this.tail[i].x && this.y === this.tail[i].y) {
                this.totalFruit = 0;
                this.tail = [];
                setState("gameover"); 
            }
        }
    }
};

// ~~~~~~~FRUIT~~~~~~~~~
function Fruit() {
    this.x;
    this.y;

    this.randomLocation = function() {
        this.x = (Math.floor(Math.random() * rows +1) - 1) *scale;
        this.y = (Math.floor(Math.random() * rows +1) - 1) *scale;
    };

this.draw = function() {
    ctx.fillRect(this.x, this.y, scale, scale); 
    ctx.fillStyle = "#00DB41";
        ctx.strokeStyle = "#000";
        ctx.strokeRect(this.x, this.y, scale, scale); 
        ctx.lineWidth = 2;
    };
}

// ~~~~~~~GAME STATE HANDLING ~~~~~~~
function setState(state) {
    gameState = state;
    if (state === "gameover") {
        gameOverTune.play()
        gameOverMenu.style.visibility = "visible";
    } else if (state === "play") {
        gameOverMenu.style.visibility = "hidden";
    } if (state === "start") {
startMenu.style.visibility = "visible"
    } else if (state !== "start") {
        startMenu.style.visibility = "hidden"
    }
}

// ~~~~~~~~RESET~~~~~~~~~
function restart() {
    snake.x = 260;
    snake.y= 220;
    snake.totalFruit = 0;
    snake.tail = [];
gameOverMenu.style.visibility = "hidden";
    setState("play")
    startTune.play();
    }
        
