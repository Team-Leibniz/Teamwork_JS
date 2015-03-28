var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var previousTime = Date.now();
var previousTimeRightCar = Date.now();
var previousTimeLeftCar = Date.now();
var previousTimeUpCar = Date.now();


var input = new Input();
attachListeners(input);

var player1 = new Player(canvas.width/4, 1,0);

var carsArrRight = [];
var carsArrLeft = [];
var carsArrUp = [];
var pricesArr = [];
var positionY = [24,45,66,118,140,162,256,278,300,356,381,406,493,518,543,601,627,653];
var prevRightCarRow;
var prevLeftCarRow;
var prevUpCarRow;
var isGameOver;
var gameDofficulty = 1;

//var animCoins = new Animation(35,55,0,0,6,
//    'resources/coin_spritesheet.png',5,0,7);
//animCoins.position.set(20,20);
//animCoins.cropPostion.set(20,20);

function generatePrices() {
    var posX = randomNumInRange(20,canvas.width -50);
    var posY = randomNumInRange(20,canvas.height - 50)
    var price = new Price(posX,posY);
    pricesArr.push(price);
}

function generateCars(){

    if(carsArrRight.length < 55 && getDiffInTime(previousTimeRightCar) >= gameDofficulty) {
        do {
            var rand = randomNumInRange(0,5)
        } while(rand == prevRightCarRow);
        var posY = positionY[Math.floor(Math.random()*positionY.length)];
        prevRightCarRow = rand;
        carsArrRight.push(new Car(1, posY,'right'));
        previousTimeRightCar = Date.now();
    }
    if(carsArrLeft.length < 55 && getDiffInTime(previousTimeLeftCar) >= gameDofficulty) {
        do {
            var rand = randomNumInRange(0,5)
        } while(rand == prevLeftCarRow);
        var posY = positionY[Math.floor(Math.random()*positionY.length)];
        prevLeftCarRow = rand;
        carsArrLeft.push(new Car(canvas.width-50, posY,'left'));
        previousTimeLeftCar = Date.now();
    }
    if(carsArrUp.length < 4 && getDiffInTime(previousTimeUpCar) >= gameDofficulty*1.5) {
        do {
            var rand = randomNumInRange(0,2)
        } while(rand == prevUpCarRow);
        var posX = canvas.width/2 - 50 * rand;
        prevUpCarRow = rand;
        carsArrUp.push(new Car(posX, canvas.height,'up'));
        previousTimeUpCar = Date.now();
    }
}


// Initialise sounds
var collision = document.getElementById("collide");
var carHorn1 = document.getElementById("car-horn1");
var carHorn2 = document.getElementById("car-horn2");





function update() {
    this.tick();
    this.render(ctx);
    requestAnimationFrame(update);
}

function tick() {
    movePlayer();
    generateCars();
    modifyCarSpeed();

    carsArrRight.forEach(function(car){
        //if(car.position.x +  car.width >= canvas.width || car.position.x <= 0) {
        //    car.velocityModifierX *= -1;
        //}
        if(car.position.x +  car.width >= canvas.width) {
            //car.position.x = 1;
            carsArrRight.removeAt(carsArrRight.indexOf(car));
            generateCars();
        }

        if(player1.boundingBox.intersects(car.boundingBox)) {
            //car.velocityModifierY *= -1;
            //collision.pause();
            gameOver();
        }
        carsArrUp.forEach(function(carUp){
            if(car.boundingBox.intersects(carUp.boundingBox)) {
                carUp.position.y += (carUp.velocity + 1);
                if(!isGameOver){
                    carHorn1.currentTime = 0;
                    carHorn1.volume = 0.4;
                    carHorn1.play();
                }
            }
            //carUp.update();

        });

        car.update();

    });

    carsArrLeft.forEach(function(car){
        //if(car.position.x +  car.width >= canvas.width || car.position.x <= 0) {
        //    car.velocityModifierX *= -1;
        //}
        if(car.position.x <= 0) {
            //car.position.x = 1;
            carsArrLeft.removeAt(carsArrLeft.indexOf(car));
            generateCars();
        }

        if(player1.boundingBox.intersects(car.boundingBox)) {
            //car.velocityModifierY *= -1;
            //collision.pause();
            gameOver();
        }
        carsArrUp.forEach(function(carUp){
            if(car.boundingBox.intersects(carUp.boundingBox)) {
                carUp.position.y += (carUp.velocity + 1);
                if(!isGameOver){
                    carHorn1.currentTime = 0;
                    carHorn1.volume = 0.4;
                    carHorn1.play();
                }
            }
            //carUp.update();
        });

        car.update();
    });


    carsArrUp.forEach(function(car){
        if(car.position.y <= 0) {
            carsArrUp.removeAt(carsArrUp.indexOf(car));
            generateCars();
        }

        if(player1.boundingBox.intersects(car.boundingBox)) {
            //car.velocityModifierY *= -1;
            //collision.pause();
            gameOver();
        }

        carsArrLeft.forEach(function(carLeft){
            if(car.boundingBox.intersects(carLeft.boundingBox)) {
                carLeft.position.x += (carLeft.velocity * 0.5);
            }
        });


        car.update();
    });

    //check for collision between player and price
    pricesArr.forEach(function(price){
        if(price.boundingBox.intersects(player1.boundingBox)) {
            player1.scores += 50;
            pricesArr.removeAt(pricesArr.indexOf(price));
        }
    });

    player1.update();

    //update prices
    if(pricesArr.length < 1) {
        generatePrices();
    }
    if(pricesArr.length > 0) {
        pricesArr.forEach(function(price){
            price.update()
        });
    }
    document.getElementById('scores').innerText = 'Scores: ' + player1.scores;


}

function render(ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if(!isGameOver){
        player1.render(ctx);
    }
    carsArrRight.forEach(function(car){
        car.render(ctx);
    });
    carsArrLeft.forEach(function(car){
        car.render(ctx);
    });
    carsArrUp.forEach(function(car){
        car.render(ctx);
    });

    //draw prices
    if(pricesArr.length > 0) {
        pricesArr.forEach(function(elem){
            elem.render(ctx);
        });
    }
}

function movePlayer() {
    player1.movement.right = !!input.right;
    player1.movement.left = !!input.left;
    player1.movement.up = !!input.up;
    player1.movement.down = !!input.down;
}
function getDiffInTime (prevTime) {
    var now = Date.now();
    var difference = Math.abs(now - prevTime) / 1000;
    return difference;
}

function modifyCarSpeed() {
    var now = Date.now();
    var difference = Math.abs(now - previousTime) / 1000;
    if(difference >= 10) {
        previousTime = now;
        carsArrRight.forEach(function(car){
            car.velocityModifierX += 0.01;
        });
        carsArrLeft.forEach(function(car){
            car.velocityModifierX += 0.01;
        });
        carsArrUp.forEach(function(car){
            car.velocityModifierY += 0.01;
        });

    }
}
function gameOver() {
    document.getElementById('game-over').style.display = 'block';
    document.getElementById('game-over-overlay').style.display = 'block';
    isGameOver = true;
    document.getElementById('play-again').addEventListener('click', function() {
        reset();
    });
}

function reset() {
    document.getElementById('game-over').style.display = 'none';
    document.getElementById('game-over-overlay').style.display = 'none';
    isGameOver = false;

    carsArrRight = [];
    carsArrLeft = [];
    carsArrUp = [];
    pricesArr = [];
    player1.scores = 0;

    player1.position.x = randomNumInRange(0, canvas.width-player1.width);
    player1.position.y = randomNumInRange(0, canvas.height-player1.height);
}

function randomNumInRange(min,max) {
   var randNum =  Math.floor(Math.random() * (max - min +1)) + min;
    return randNum;
}

update();
