/**
 * Created by toshiba on 23.3.2015 г..
 */

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var previousTime = Date.now();
var previousTimeRightBall = Date.now();
var previousTimeLeftBall = Date.now();
var previousTimeUpBall = Date.now();


var input = new Input();
attachListeners(input);

var player1 = new Player(canvas.width/4, 1,0);

var ballsArrRight = [];
var ballsArrLeft = [];
var ballsArrUp = [];
var pricesArr = [];
var prevRightBallRow;
var prevLeftBallRow;
var prevUpBallRow;

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

function generateBalls(){

    if(ballsArrRight.length < 5 && getDiffInTime(previousTimeRightBall) >= 0.5) {
        do {
            var rand = randomNumInRange(0,5)
        } while(rand == prevRightBallRow);
        var posY = 50 + 100 * rand;
        prevRightBallRow = rand;
        ballsArrRight.push(new Ball(1, posY,'right'));
        previousTimeRightBall = Date.now();
    }
    if(ballsArrLeft.length < 5 && getDiffInTime(previousTimeLeftBall) >= 0.5) {
        do {
            var rand = randomNumInRange(0,5)
        } while(rand == prevLeftBallRow);
        var posY = 100 + 100 * rand;
        prevLeftBallRow = rand;
        ballsArrLeft.push(new Ball(canvas.width-50, posY,'left'));
        previousTimeLeftBall = Date.now();
    }
    if(ballsArrUp.length < 4 && getDiffInTime(previousTimeUpBall) >= 1) {
        do {
            var rand = randomNumInRange(0,2)
        } while(rand == prevUpBallRow);
        var posX = canvas.width/2 - 50 * rand;
        prevUpBallRow = rand;
        ballsArrUp.push(new Ball(posX, canvas.height,'up'));
        previousTimeUpBall = Date.now();
    }
}


// Initialise sounds
var collision = document.getElementById("collide");
var carHorn = document.getElementById("car-horn");





function update() {
    this.tick();
    this.render(ctx);
    requestAnimationFrame(update);
}

function tick() {
    movePlayer();
    generateBalls();
    modifyBallSpeed();

    ballsArrRight.forEach(function(ball){
        //if(ball.position.x +  ball.width >= canvas.width || ball.position.x <= 0) {
        //    ball.velocityModifierX *= -1;
        //}
        if(ball.position.x +  ball.width >= canvas.width) {
            //ball.position.x = 1;
            ballsArrRight.removeAt(ballsArrRight.indexOf(ball));
            generateBalls();
        }

        if(player1.boundingBox.intersects(ball.boundingBox)) {
            //ball.velocityModifierY *= -1;
            //collision.pause();
            collision.currentTime = 0;
            collision.play();
        }
        ballsArrUp.forEach(function(ballUp){
            if(ball.boundingBox.intersects(ballUp.boundingBox)) {
                ballUp.position.y += (ballUp.velocity + 1);
                carHorn.currentTime = 0;
                carHorn.play();
            }
            //ballUp.update();

        });

        ball.update();

    });

    ballsArrLeft.forEach(function(ball){
        //if(ball.position.x +  ball.width >= canvas.width || ball.position.x <= 0) {
        //    ball.velocityModifierX *= -1;
        //}
        if(ball.position.x <= 0) {
            //ball.position.x = 1;
            ballsArrLeft.removeAt(ballsArrLeft.indexOf(ball));
            generateBalls();
        }

        if(player1.boundingBox.intersects(ball.boundingBox)) {
            //ball.velocityModifierY *= -1;
            //collision.pause();
            collision.currentTime = 0;
            collision.play();
        }
        ballsArrUp.forEach(function(ballUp){
            if(ball.boundingBox.intersects(ballUp.boundingBox)) {
                ballUp.position.y += (ballUp.velocity + 1);
                carHorn.currentTime = 0;
                carHorn.play();
            }
            //ballUp.update();
        });

        ball.update();
    });


    ballsArrUp.forEach(function(ball){
        if(ball.position.y <= 0) {
            ballsArrUp.removeAt(ballsArrUp.indexOf(ball));
            generateBalls();
        }

        if(player1.boundingBox.intersects(ball.boundingBox)) {
            //ball.velocityModifierY *= -1;
            //collision.pause();
            collision.currentTime = 0;
            collision.play();
        }

        ballsArrLeft.forEach(function(ballLeft){
            if(ball.boundingBox.intersects(ballLeft.boundingBox)) {
                ballLeft.position.x += (ballLeft.velocity * 0.5);
            }
        });


        ball.update();
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
    player1.render(ctx);
    ballsArrRight.forEach(function(ball){
        ball.render(ctx);
    });
    ballsArrLeft.forEach(function(ball){
        ball.render(ctx);
    });
    ballsArrUp.forEach(function(ball){
        ball.render(ctx);
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

function modifyBallSpeed() {
    var now = Date.now();
    var difference = Math.abs(now - previousTime) / 1000;
    if(difference >= 10) {
        previousTime = now;
        ballsArrRight.forEach(function(ball){
            ball.velocityModifierX += 0.01;
        });
        ballsArrLeft.forEach(function(ball){
            ball.velocityModifierX += 0.01;
        });
        //ballsArrUp.forEach(function(ball){
        //    ball.velocityModifierY += 0.01;
        //});

    }
}
//function refresh(){
//    var startRange = 100;
//    var endRange = canvas.height - startRange;
//    var startX = Math.floor(Math.random() * canvas.width);
//    var startY = Math.floor(Math.random() * (endRange - startRange +1)) + startRange;
//    ball.position.x = startX;
//    ball.position.y = startY;
//    ball.movement.left = false;
//    ball.movement.right = false;
//    ball.movement.down = false;
//    ball.movement.up = false;
//    ball.velocityModifierX = 1;
//    ball.velocityModifierY = 1;
//    if(startY < canvas.height/2) {
//        ball.movement.down = true;
//        var rand = Math.floor(Math.random() * 2);
//        if(rand === 1) {
//            ball.movement.left = true;
//        }else {
//            ball.movement.right = true;
//        }
//    } else {
//        ball.movement.up = true;
//        var rand = Math.floor(Math.random() * 2);
//        if(rand === 1) {
//            ball.movement.left = true;
//        }else {
//            ball.movement.right = true;
//        }
//    }
//}

function randomNumInRange(min,max) {
   var randNum =  Math.floor(Math.random() * (max - min +1)) + min;
    return randNum;
}

update();
