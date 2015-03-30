/**
 * Created by toshiba on 28.3.2015 г..
 */

function generatePlayer() {
    var player1 = new Player(canvas.width/4, 1,0);
    return player1
}
function generatePrices(type) {
    var posX = randomNumInRange(20,canvas.width -50);
    var posY = randomNumInRange(20,canvas.height - 50)
    var price = new Price(posX,posY,type);
    switch (type) {
        case 'money' : moneyArr.push(price); break
        case 'bomb' : bombArr.push(price); break;
        default : break;
    }
}

function deployBomb(posX,posY,bombDeployTime) {
    var bomb = new DepBombs(posX,posY,bombDeployTime,'depBomb');
    //var bomb = new Price(posX,posY,'money');

    deployedBombs.push(bomb);
}
function deployedExplosion(posX,posY,explDeployTime) {
    var explosion = new DepBombs(posX,posY,explDeployTime,'explosion');
    //var bomb = new Price(posX,posY,'money');

    explosionsArr.push(explosion);
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


function randomNumInRange(min,max) {
    var randNum =  Math.floor(Math.random() * (max - min +1)) + min;
    return randNum;
}
