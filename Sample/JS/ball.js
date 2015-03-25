/**
 * Created by toshiba on 23.3.2015 г..
 */
var Ball = (function () {
    function Ball(x, y) {
        this.position = new Vector2(x, y);
        this.width = 29;
        this.height = 30;
        this.velocity = 5;
        this.velocityModifierX = 1;
        this.velocityModifierY = 1;
        this.movement = {left: false, right : false, up: false, down : false};

        this.animation = new Animation(this.width, this.height, 0, 0, 1, 'resources/ball.PNG', 1, 1, 1);
        this.boundingBox = new Rectangle(x, y, this.width, this.height);
    }

    Ball.prototype.update = function () {
        if(this.movement.right ) {
            this.position.x += (this.velocity + 5) * this.velocityModifierX;
        }
        if(this.movement.left ) {
            this.position.x -= ((this.velocity + 5) * this.velocityModifierX);
        }

        //if(this.movement.down) {
        //    this.position.y += (this.velocity - 2) * this.velocityModifierY;
        //}
        //if(this.movement.up) {
        //    this.position.y -= ((this.velocity -2) * this.velocityModifierY);
        //}

        this.animation.position.set(this.position.x, this.position.y);
        this.boundingBox.x = this.position.x;
        this.boundingBox.y = this.position.y;
        this.animation.update();
    };

    Ball.prototype.render = function(ctx) {
        this.animation.draw(ctx);
    };

    return Ball;
}());
