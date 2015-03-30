
var Player = (function(){
    function Player(x, y, rowClip) {
        this.position = new Vector2(x, y);
        this.movement = {left: false, right : false, up: false, down: false};
        this.velocity = 3;
        this.width = 95;
        this.height = 159;
        this.scores = 0;
        this.resizeIndex = 2.7;
        this.rightKeyPressed = false;
        this.leftKeyPressed = false;
        this.upKeyPressed = false;
        this.downKeyPressed = false;

        this.animation = new Animation( this.width, this.height, 0, 0, 1, 'resources/player.png', 1, 1, 0, this.resizeIndex);
        this.boundingBox = new Rectangle ( x, y, this.width/this.resizeIndex -5, this.height/this.resizeIndex-5);
    }

    Player.prototype.update = function() {
        if(this.movement.right) {
            this.leftKeyPressed = false;
            this.downKeyPressed=false;
            this.leftKeyPressed = false;
            if(this.position.x + this.velocity <= canvas.width - this.width/this.resizeIndex) {
                this.position.x += this.velocity;

            }
            if(!this.rightKeyPressed){
                this.animation = new Animation( this.width, this.height, 2, 0, 12, 'resources/player.png', 9, 12, 2, this.resizeIndex);
            }
            this.rightKeyPressed=true;


        } else if(this.movement.left) {
            this.rightKeyPressed=false;
            this.downKeyPressed=false;
            this.rightKeyPressed = false;
            if(this.position.x - this.velocity > 0) {
                this.position.x -= this.velocity;

            }
             if(!this.leftKeyPressed)
             {
                 this.animation = new Animation( this.width, this.height, 1, 0, 12, 'resources/player.png', 9, 12, 2, this.resizeIndex);
             }
            this.leftKeyPressed = true;

        } else if(this.movement.up) {
            this.downKeyPressed=false;
            this.leftKeyPressed = false;
            this.rightKeyPressed = false;
            if(this.position.y - this.velocity > 0) {
                this.position.y -= this.velocity;


            }
            if(!this.upKeyPressed){
                this.animation = new Animation( this.width, this.height, 3, 0, 12, 'resources/player.png', 9, 12, 3, this.resizeIndex);
            }
            this.upKeyPressed = true;


        } else if(this.movement.down) {
            this.upKeyPressed=false;
            this.leftKeyPressed = false;
            this.rightKeyPressed = false;
            if (this.position.y + this.velocity <= canvas.height - this.height/this.resizeIndex) {
                this.position.y += this.velocity;

            }
            if(!this.downKeyPressed){
                this.animation = new Animation( this.width, this.height, 0, 0, 12, 'resources/player.png', 9, 12, 0, this.resizeIndex);
            }
            this.downKeyPressed=true;


        }
        this.animation.position.set(this.position.x, this.position.y);
        this.boundingBox.x = this.position.x;
        this.boundingBox.y = this.position.y;this.animation.update();
    };

    Player.prototype.render = function(ctx) {
        this.animation.draw(ctx);
    };

    return Player;
}());
