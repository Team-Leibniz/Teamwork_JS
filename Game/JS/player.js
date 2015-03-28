/**
 * Created by toshiba on 23.3.2015 г..
 */
var Player = (function(){
    function Player(x, y, rowClip) {
        this.position = new Vector2(x, y);
        this.movement = {left: false, right : false, up: false, down: false};
        this.velocity = 3;
        this.width = 128;
        this.height = 48;
        this.scores = 0;
        this.resizeIndex = 2;

        this.animation = new Animation( this.width, this.height, rowClip, 0, 1, 'resources/paddles.PNG', 1, 2, 1, this.resizeIndex);
        this.boundingBox = new Rectangle ( x, y, this.width/this.resizeIndex, this.height/this.resizeIndex)
    }

    Player.prototype.update = function() {
        if(this.movement.right) {
            if(this.position.x + this.velocity <= canvas.width - this.width) {
                this.position.x += this.velocity;
            }

        } else if(this.movement.left) {
            if(this.position.x - this.velocity > 0) {
                this.position.x -= this.velocity;
            }
        } else if(this.movement.up) {
            if(this.position.y - this.velocity > 0) {
                this.position.y -= this.velocity;
            }
        } else if(this.movement.down) {
            if (this.position.y + this.velocity <= canvas.height - this.height) {
                this.position.y += this.velocity;
            }
        }

        this.animation.position.set(this.position.x, this.position.y);
        this.boundingBox.x = this.position.x;
        this.boundingBox.y = this.position.y;
        this.animation.update();
    };

    Player.prototype.render = function(ctx) {
        this.animation.draw(ctx);
    };

    return Player;
}());
