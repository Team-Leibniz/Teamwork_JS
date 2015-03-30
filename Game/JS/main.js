var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var previousTime = Date.now();
var previousTimeRightCar = Date.now();
var previousTimeLeftCar = Date.now();
var previousTimeUpCar = Date.now();


var input = new Input();
attachListeners(input);

var player1 = generatePlayer();

var carsArrRight = [];
var carsArrLeft = [];
var carsArrUp = [];
var moneyArr = [];
var positionY = [24,45,66,118,140,162,256,278,300,356,381,406,493,518,543,601,627,653];
var prevRightCarRow;
var prevLeftCarRow;
var prevUpCarRow;
var isGameOver;
var gameDofficulty = 2;
var bombArr = [];
var deployedBombs = [];
var explosionsArr = [];
var prevBombGenTime = Date.now();
var isBombDeployed = false;

//var animCoins = new Animation(35,55,0,0,6,
//    'resources/coin_spritesheet.png',5,0,7);
//animCoins.position.set(20,20);
//animCoins.cropPostion.set(20,20);



// Initialise sounds
var collision = document.getElementById("collide");
var carHorn1 = document.getElementById("car-horn1");
var carHorn2 = document.getElementById("car-horn2");
var carCrash = document.getElementById("car-crash");
var coinSound = document.getElementById("coin-sound");
var explosionSound = document.getElementById("explosion");


var runOverPic = new Image();
runOverPic.src = 'resources/runOver.jpg';
ctx.drawImage(runOverPic,200,150); // image,x,y,size





function update() {
    this.tick();
    this.render(ctx);
    requestAnimationFrame(update);
}

function tick() {
    movePlayer();
    generateCars();
    modifyCarSpeed();
    if(isBombDeployed && (player1.bomb > 0)) {
        deployBomb(player1.position.x, player1.position.y,Date.now());
        isBombDeployed = false;
    }

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
            car.position.x -= (car.velocity + 1);
            if(!isGameOver){
                isGameOver = true;
                ctx.drawImage(runOverPic,player1.position.x,player1.position.y,200,150); // image,x,y,size
                carCrash.play();
                var timeOut = setTimeout(gameOver,2000);
                //gameOver();
            }
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
            car.position.x += (car.velocity + 1);
            if(!isGameOver){
                ctx.drawImage(runOverPic,player1.position.x,player1.position.y,200,150); // image,x,y,size
                isGameOver = true;
                carCrash.play();
                var timeOut = setTimeout(gameOver,2000);
                //gameOver();
            }
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
            car.position.y += (car.velocity + 1);
            ctx.drawImage(runOverPic,player1.position.x,player1.position.y,200,150); // image,x,y,size
            if(!isGameOver){
                ctx.drawImage(runOverPic,player1.position.x,player1.position.y,200,150); // image,x,y,size
                isGameOver = true;
                carCrash.play();
                var timeOut = setTimeout(gameOver,2000);
                //gameOver();
            }
        }

        carsArrLeft.forEach(function(carLeft){
            if(car.boundingBox.intersects(carLeft.boundingBox)) {
                carLeft.position.x += (carLeft.velocity * 0.5);
            }
        });


        car.update();
    });

    //check for collision between player and money price
    if(moneyArr.length > 0) {
        moneyArr.forEach(function(price){
            if(price.boundingBox.intersects(player1.boundingBox)) {
                player1.scores += 50;
                moneyArr.removeAt(moneyArr.indexOf(price));
                coinSound.volume = 1;
                coinSound.play();
            }
        });
    }

    //check for collision between player and bomb price
    if(bombArr.length > 0) {
        bombArr.forEach(function(price){
            if(price.boundingBox.intersects(player1.boundingBox)) {
                player1.bomb ++;
                bombArr.removeAt(moneyArr.indexOf(price));

            }
        });
    }



    //update prices
    if(moneyArr.length < 1) {
        generatePrices('money');
    }
    if(moneyArr.length > 0) {
        moneyArr.forEach(function(price){
            price.update()
        });
    }
    //update bomb price
    if((bombArr.length < 1) && (player1.bomb < 1 ) && (getDiffInTime(prevBombGenTime) >= 5 )) {
        generatePrices('bomb');
        prevBombGenTime = Date.now();
    }
    //if((bombArr.length < 1) && (getDiffInTime(prevBombGenTime) >= 5 )) {
    //    generatePrices('bomb');
    //    prevBombGenTime = Date.now();
    //}

    if(bombArr.length > 0) {
        bombArr.forEach(function(price){
            price.update()
        });
    }

    //update deployed bomb
    if(deployedBombs.length > 0) {
        deployedBombs.forEach(function(bomb){
            bomb.count ++ ;
            if(bomb.count > 200) {
                explosionSound.currentTime = 0;
                explosionSound.volume = 1;
                explosionSound.play();
                deployedExplosion(bomb.position.x,bomb.position.y,Date.now());
                deployedBombs.removeAt(deployedBombs.indexOf(bomb));
            }
            bomb.update()
        });
    }

    //update explosions
    if(explosionsArr.length > 0) {
        explosionsArr.forEach(function(explosion){
            explosion.count ++ ;
            if(explosion.count > 100) {
                explosionsArr.removeAt(explosion.indexOf(explosion));
            }
            explosion.update()
        });
    }

    player1.update();
    document.getElementById('scores').innerText = 'Scores: ' + player1.scores;
    document.getElementById('bombs-quantity').innerText = 'Bombs: ' + player1.bomb;


}

function render(ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if(!isGameOver){
        player1.render(ctx);
    }
    carsArrRight.forEach(function(car){
        car.render(ctx);
        ctx.strokeRect(car.position.x,car.position.y,car.width,car.height);
    });
    carsArrLeft.forEach(function(car){
        car.render(ctx);
        ctx.strokeRect(car.position.x,car.position.y,car.width,car.height);
    });
    carsArrUp.forEach(function(car){
        car.render(ctx);
        ctx.strokeRect(car.position.x,car.position.y,car.width,car.height);
    });

    //draw prices
    if(moneyArr.length > 0) {
        moneyArr.forEach(function(elem){
            elem.render(ctx);
        });
    }
    //draw bomb price
    if(bombArr.length > 0) {
        bombArr.forEach(function(elem){
            elem.render(ctx);
        });
    }
    //draw deplyed bomb
    if(deployedBombs.length > 0) {
        deployedBombs.forEach(function(bomb){
            bomb.render(ctx);
        });
    }

    //draw explosions
    if(explosionsArr.length > 0) {
        explosionsArr.forEach(function(explosion){
            explosion.render(ctx);
        });
    }

}

function movePlayer() {
    player1.movement.right = !!input.right;
    player1.movement.left = !!input.left;
    player1.movement.up = !!input.up;
    player1.movement.down = !!input.down;
    isBombDeployed = !!input.b;
}
function getDiffInTime (prevTime) {
    var now = Date.now();
    var difference = (Math.abs(now - prevTime) / 1000);
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
    player1.position.set(-30,-30);
    document.getElementById('game-over').style.display = 'block';
    document.getElementById('game-over-overlay').style.display = 'block';
    //isGameOver = true;
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
    moneyArr = [];
    player1.scores = 0;
    player1.position.x = randomNumInRange(30, canvas.width-player1.width-30);
    player1.position.y = randomNumInRange(0, canvas.height-player1.height);
}

update();
