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
    this.anim = [];

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
    this.glide = false;
    this.width = 128;
    this.height = 128;

}
Player.prototype = new Entity();
Player.prototype.constructor = Player;


Player.prototype.update = function () {
    this.color = "#0F0";

    if (this.glide && this.gravity < -1) {
        this.gravity -= -1 ;
    } else {
        this.gravity -= 0.1;
    }

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
        if (this.gravity < 0 && recsOverlap(this.position.x, this.position.y, this.width, this.height,
            clouds[i].position.x, clouds[i].position.y, clouds[i].width, clouds[i].height)) {
            if (this.position.y + (this.height - 32) < clouds[i].position.y) {
                this.position = new Vec2(this.position.x, clouds[i].position.y - this.height);
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

    if (Key.isDown(Key.SHIFT)) {
        this.glide = true;
    } else {
        this.glide = false;
    }



    if (CAMy < nextSegment) {

        var style = getRnd(0, 8);
        switch (style) {
            case 0: // RANDOM COLUMNS
                for (var i = 0; i < 8; i++) {
                    var temp = getRnd(0, 1);
                    temp == 1 ? clouds.push(new Cloud(128, nextSegment - (i * 150), 1)) : clouds.push(new Cloud(1024 - 256, nextSegment - (i * 150), 1));
                    //                    clouds.push(new Cloud(128 * i, nextSegment - (i * 150), 1));
                }
                nextSegment -= 8 * 150;
                break;
            case 1: //COLUMNS
                for (var i = 0; i < 2; i++) {
                    for (var j = 0; j < 5; j++) {
                        i == 0 ? clouds.push(new Cloud(128, nextSegment - (j * 100), 1)) : clouds.push(new Cloud(1024 - 256, nextSegment - (j * 100), 1));
                    }
                }
                nextSegment -= 5 * 100;
                break;
            case 2: //DIAGONAL TO RIGHT
                for (var i = 0; i < 6; i++) {
                    clouds.push(new Cloud(128 * i, nextSegment - (i * 128), 1));
                }
                nextSegment -= 6 * 128;
                break;
            case 3: //DIAGONAL TO LEFT
                for (var i = 0; i < 6; i++) {
                    clouds.push(new Cloud(1024 - (128 * i), nextSegment - (i * 128), 1));
                }
                nextSegment -= 6 * 128;
                break;
            case 4: //sine
                var temp = getRnd(200, 800);
                for (var i = 0; i < 12; i++) {
                    
                    clouds.push(new Cloud(temp + (128 * (Math.sin(i / 0.01))), nextSegment - (i * 128), 1));
                }
                nextSegment -= 12 * 128;
                break;
            case 5: // double sine
                for (var j = 0; j < 2; j++) {
                    for (var i = 0; i < 12; i++) {
                        j == 0 ? clouds.push(new Cloud(128 + (128 * (Math.sin(i / 0.01))), nextSegment - (i * 128), 1))
                        : clouds.push(new Cloud(700 + (128 * (Math.sin(i / 0.01))), nextSegment - (i * 128), 1));
                    }
                }
                nextSegment -= 12 * 128;
                break;
            case 6://HELIX 
                for (var j = 0; j < 2; j++) {
                    for (var i = 0; i < 12; i++) {
                        j == 0 ? clouds.push(new Cloud(128 + (128 * (Math.sin(i / 0.01))), nextSegment - (i * 128), 1))
                        : clouds.push(new Cloud(700 + (128 * (Math.cos(i / 0.01))), nextSegment - (i * 128), 1));
                    }
                }
                nextSegment -= 12 * 128;
                break;
            case 7: //HELIX MIRROR
                for (var j = 0; j < 2; j++) {
                    for (var i = 0; i < 12; i++) {
                        j == 0 ? clouds.push(new Cloud(128 + (128 * (Math.cos(i / 0.01))), nextSegment - (i * 128), 1))
                        : clouds.push(new Cloud(700 + (128 * (Math.sin(i / 0.01))), nextSegment - (i * 128), 1));
                    }
                }
                nextSegment -= 12 * 128;
                break;
            case 8: //SCATTER
                for (var i = 0; i < 12; i++) {
                    var temp = getRnd(200, 800);
                    clouds.push(new Cloud(temp + (128 * (Math.sin(i / 0.01))), nextSegment - (i * 128), 1));
                }
                nextSegment -= 12 * 128;
                break;

        }

    }

};



