
var Price = (function () {
    function Price(x, y) {
        this.position = new Vector2(x, y);
        this.width = 64;
        this.height = 64;
        this.resizeIndex = 2;

        this.animation = new Animation(this.width,this.height,0,0,32,
            'resources/gold_coin.png',12,0,0,this.resizeIndex);
        this.boundingBox = new Rectangle(x, y, this.width/this.resizeIndex, this.height/this.resizeIndex);
    }

    Price.prototype.update = function () {

        this.animation.position.set(this.position.x, this.position.y);
        this.boundingBox.x = this.position.x;
        this.boundingBox.y = this.position.y;
        this.animation.update();
    };

    Price.prototype.render = function(ctx) {
        this.animation.draw(ctx);
    };

    return Price;
}());
