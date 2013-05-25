function Entity(x, y) {

    this.position = new Vec2(x, y);
    this.targetPosition = new Vec2(x, y);
    this.width = 12;
    this.height = 12;
    this.color = "#FFF";
    this.ID = 0;
    this.lastEmit = 0;
    this.gravity = 0;
    this.jump = true;
    this.image = false;
    this.active = true;

}

Entity.prototype.update = function () {

};

Entity.prototype.draw = function (offx, offy) {
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.translate(this.position.x - offx, this.position.y - offy);
    if (!this.image) {
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
    } else {
        ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height);

    }
    ctx.restore();
};



function Player(x, y) {

    Entity.call(this, x, y);
    this.image = imgDiablo;

}
Player.prototype = new Entity();
Player.prototype.constructor = Player;


Player.prototype.update = function () {
    this.color = "#0F0";

    this.gravity -= 0.1;


    /* if (this.position.y - CAMy > 768) {
         this.jump = false;
         this.gravity = 0;
         this.position = new Vec2(this.position.x, 768);
     }*/

    // CAMx = (this.position.x + this.image.width / 2) - SCREEN_W / 2;
    CAMx = 0;
    if (this.position.y < CAMy + 319) {
        CAMy = (this.position.y + this.image.height / 2) - SCREEN_H / 2;
    }

    for (var i in clouds) {
        if (this.gravity < 0 && recsOverlap(this.position.x, this.position.y, this.image.width, this.image.height,
            clouds[i].position.x, clouds[i].position.y, clouds[i].image.width, clouds[i].image.height)) {
            if (this.position.y + (this.image.height - 32) < clouds[i].position.y) {
                this.position = new Vec2(this.position.x, clouds[i].position.y - this.image.height);
                this.gravity = 0;
                this.jump = false;
            }
        }
    }

    // Easteregg, muhAHA
    this.position = new Vec2(this.position.x, this.position.y - this.gravity);

    if (Key.isDown(Key.UP) && !this.jump) {
        this.jump = true;
        this.gravity = 10;
    }

    if (Key.isDown(Key.LEFT)) {
        this.position = new Vec2(this.position.x - 5, this.position.y);
    }

    if (Key.isDown(Key.RIGHT)) {
        this.position = new Vec2(this.position.x + 5, this.position.y);
    }

    if (this.position.y < nextSegment) {

        nextSegment -= 768;
        var style = getRnd(0, 100);
        if (style < 50) {
            for (var i = 0; i < 10; i++) {
                clouds.push(new Cloud(128 * i, nextSegment, 1));
            }
        } else {
            for (var i = 0; i < 2; i++) {
                for (var j = 0; j < 5; j++) {

                    clouds.push(new Cloud(128 * (i * 5), nextSegment - (j*100), 1));
                }
            }
        }
    }

};



