/**
 * Created by toshiba on 23.3.2015 г..
 */
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var input = new Input();
attachListeners(input);

var player1 = new Player(canvas.width/2, 1,0);
var player2 = new Player(canvas.width/2, canvas.height-50,1);
document.getElementById('player1scores').innerText = player1.scores;
document.getElementById('player2scores').innerText = player2.scores;

//random start ball position and direction
var startRange = 100;
var endRange = canvas.height - startRange;
var startX = Math.floor(Math.random() * canvas.width);
var startY = randomNumInRange(startRange,endRange);
var ball = new Ball(startX, startY);
if(startY < canvas.height/2) {
    ball.movement.down = true;
    var rand = Math.floor(Math.random() * 2);
    if(rand === 1) {
        ball.movement.left = true;
    }else {
        ball.movement.right = true;
    }
} else {
    ball.movement.up = true;
    var rand = Math.floor(Math.random() * 2);
    if(rand === 1) {
        ball.movement.left = true;
    }else {
        ball.movement.right = true;
    }
}


// Initialise the collision sound
var collision = document.getElementById("collide");


var previousTime = Date.now();
var previousHit;

//// Restart Button object
//restartBtn = {
//    w: 100,
//    h: 50,
//    x: W/2 - 50,
//    y: H/2 - 50,
//
//    draw: function() {
//        ctx.strokeStyle = "white";
//        ctx.lineWidth = "2";
//        ctx.strokeRect(this.x, this.y, this.w, this.h);
//
//        ctx.font = "18px Arial, sans-serif";
//        ctx.textAlign = "center";
//        ctx.textBaseline = "middle";
//        ctx.fillStlye = "white";
//        ctx.fillText("Restart", W/2, H/2 - 25 );
//    }
//};


function update() {
    this.tick();
    this.render(ctx);
    requestAnimationFrame(update);
}

function tick() {
    movePlayer();
    modifyBallSpeed();

    if(ball.position.x +  ball.width >= canvas.width || ball.position.x <= 0) {
        ball.velocityModifierX *= -1;
    }
    if(player1.boundingBox.intersects(ball.boundingBox) && previousHit !== 'player1') {
        ball.velocityModifierY *= -1;
        previousHit = 'player1';
        //collision.pause();
        collision.currentTime = 0;
        collision.play();
    }
    if(player2.boundingBox.intersects(ball.boundingBox) && previousHit !== 'player2') {
        ball.velocityModifierY *= -1;
        previousHit = 'player2';
        //collision.pause();
        collision.currentTime = 0;
        collision.play();
    }
    if(ball.position.y + ball.height/2 >= canvas.height) {
        player1.scores++;
        if(player1.scores === 10) {
            gameOver();
            window.alert("Player 1 is the winner!  Press F5 to refresh")
        }
        document.getElementById('player1scores').innerText = player1.scores;
        refresh();
    }
    if(ball.position.y <= 0) {
        player2.scores++;
        if(player2.scores === 10) {
            gameOver();
            window.alert("Player 2 is the winner!  Press F5 to refresh")
        }
        document.getElementById('player2scores').innerText = player2.scores;
        refresh();
    }

    ball.update();
    player1.update();
    player2.update();


}

function render(ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player1.render(ctx);
    player2.render(ctx);
    ball.render(ctx);
}

function movePlayer() {
    player1.movement.right = !!input.right;
    player1.movement.left = !!input.left;
    player2.movement.right = !!input.right;
    player2.movement.left = !!input.left;
}

function modifyBallSpeed() {
    var now = Date.now();
    var difference = Math.abs(now - previousTime) / 1000;
    if(difference >= 10) {
        previousTime = now;
        ball.velocityModifierX += 0.1;
        ball.velocityModifierY += 0.1;
    }
}
function refresh(){
    var startRange = 100;
    var endRange = canvas.height - startRange;
    var startX = Math.floor(Math.random() * canvas.width);
    var startY = Math.floor(Math.random() * (endRange - startRange +1)) + startRange;
    ball.position.x = startX;
    ball.position.y = startY;
    ball.movement.left = false;
    ball.movement.right = false;
    ball.movement.down = false;
    ball.movement.up = false;
    ball.velocityModifierX = 1;
    ball.velocityModifierY = 1;
    if(startY < canvas.height/2) {
        ball.movement.down = true;
        var rand = Math.floor(Math.random() * 2);
        if(rand === 1) {
            ball.movement.left = true;
        }else {
            ball.movement.right = true;
        }
    } else {
        ball.movement.up = true;
        var rand = Math.floor(Math.random() * 2);
        if(rand === 1) {
            ball.movement.left = true;
        }else {
            ball.movement.right = true;
        }
    }
}
//function gameOver() {
//    ctx.fillStlye = "white";
//    ctx.font = "20px Arial, sans-serif";
//    ctx.textAlign = "center";
//    ctx.textBaseline = "middle";
//    ctx.fillText("Game Over - You scored "+points+" points!", W/2, H/2 + 25 );
//
//    // Stop the Animation
//    cancelRequestAnimFrame(init);
//
//    // Set the over flag
//    over = 1;
//
//    // Show the restart button
//    restartBtn.draw();
//}

function randomNumInRange(min,max) {
   var randNum =  Math.floor(Math.random() * (max - min +1)) + min;
    return randNum;
}

update();
