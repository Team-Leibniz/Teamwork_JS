/**
 * Created by toshiba on 30.3.2015 г..
 */
var DepBombs = (function () {
    function DepBombs(x, y, bombDeployTime, name) {
        this.type = name;
        this.position = new Vector2(x, y);
        this.width = 75;
        this.height = 75;
        this.count = 0;
        this.bombDeployTime = bombDeployTime;
        this.resizeIndex = 2;
        var posX = x-100;
        var posY = y-100;

        switch(this.type) {
            case 'bomb': this.animation = new Animation(75,75,0,0,48,'resources/bomb.png',12,0,0,this.resizeIndex);
                this.boundingBox = new Rectangle(posX, posY, this.width+100, this.height+100);
                break;
            case 'explosion':  this.animation = new Animation(64,64,0,0,16,
                'resources/explosion.png',7,0,0,this.resizeIndex);
                this.boundingBox = new Rectangle(x, y, 75/this.resizeIndex, 75/this.resizeIndex);
                break;
            default : break;
        }
        //this.animation = new Animation(this.width,this.height,0,0,32,
        //    'resources/gold_coin.png',12,0,0,this.resizeIndex);
        //this.boundingBox = new Rectangle(x, y, this.width/this.resizeIndex, this.height/this.resizeIndex);
    }

    DepBombs.prototype.update = function () {

        this.animation.position.set(this.position.x, this.position.y);
        this.boundingBox.x = this.position.x;
        this.boundingBox.y = this.position.y;
        this.animation.update();
    };

    DepBombs.prototype.render = function(ctx) {
        this.animation.draw(ctx);
    };

    return DepBombs;
}());
