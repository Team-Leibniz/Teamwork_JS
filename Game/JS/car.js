var Car = (function () {
    function Car(x, y, movementPosition) {
        this.position = new Vector2(x, y);
        this.width = 35;
        this.height = 17;
        this.velocity = 3;
        this.velocityModifierX = 1;
        this.velocityModifierY = 1;
        this.movement = {left: false, right : false, up: false, down : false};
        switch (movementPosition) {
            case 'right': this.movement.right = true; break;
            case 'left': this.movement.left = true; break;
            case 'up': this.movement.up = true; break;
            case 'down': this.movement.down = true; break;
            default : break;
        }
        this.resizeIndex = 1;

        this.animation = new Animation(this.width, this.height, 0, 0, 1, 'resources/cars-right.png', 1, 1, 1, this.resizeIndex);
        this.boundingBox = new Rectangle(x, y, this.width/this.resizeIndex, this.height/this.resizeIndex);
    }

    Car.prototype.update = function () {
        if(this.movement.right ) {
            this.position.x += this.velocity * this.velocityModifierX;
        }
        if(this.movement.left ) {
            this.position.x -= (this.velocity * this.velocityModifierX);
        }

        if(this.movement.down) {
            this.position.y += (this.velocity - 2) * this.velocityModifierY;
        }
        if(this.movement.up) {
            this.position.y -= this.velocity;
        }

        this.animation.position.set(this.position.x, this.position.y);
        this.boundingBox.x = this.position.x;
        this.boundingBox.y = this.position.y;
        this.animation.update();
    };

    Car.prototype.render = function(ctx) {
        this.animation.draw(ctx);
    };

    return Car;
}());
