/**
 * Created by toshiba on 23.3.2015 г..
 */
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var previousTime = Date.now();
var previousTimeRightBall = Date.now();
var previousTimeLeftBall = Date.now();

var input = new Input();
attachListeners(input);

var player1 = new Player(canvas.width/2, 1,0);


var ballsArrRight = [];
var ballsArrLeft = [];
//generateBalls();
var prevRightBallRow;
var prevLeftBallRow;


function generateBalls(){

    if(ballsArrRight.length < 5 && getDiffInTime(previousTimeRightBall) >= 1) {
        do {
            var rand = randomNumInRange(0,5)
        } while(rand == prevRightBallRow);
        var posY = 50 + 100 * rand;
        prevRightBallRow = rand;
        ballsArrRight.push(new Ball(1, posY,'right'));
        previousTimeRightBall = Date.now();
    }
    if(ballsArrLeft.length < 5 && getDiffInTime(previousTimeLeftBall) >= 1) {
        do {
            var rand = randomNumInRange(0,5)
        } while(rand == prevLeftBallRow);
        var posY = 50 + 100 * rand;
        prevLeftBallRow = rand;
        var posY = 100 + 100 * rand;
        ballsArrLeft.push(new Ball(canvas.width-50, posY,'left'));
        previousTimeLeftBall = Date.now();
    }
}


// Initialise the collision sound
var collision = document.getElementById("collide");




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
        ball.update();
    });

    player1.update();

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
