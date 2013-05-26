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
    this.sprite = false;
    this.active = true;
    this.anim = [];
    this.maxhealth = 100;
    this.health = this.maxhealth;
    this.nextDmg = 0;

}

Entity.prototype.update = function () {

};

Entity.prototype.draw = function (offx, offy) {
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.translate(this.position.x - offx, this.position.y - offy);
    if (!this.sprite) {
        if (!this.image) {
            ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        } else {
            ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height);
        }
    } else {
        this.sprite.render(ctx);
    }

    ctx.restore();
};

Entity.prototype.takeDmg = function (amount) {

    if (this.nextDmg < $.now()) {
        this.health -= amount;
        this.nextDmg = $.now() + 400;
    }
}


function Player(x, y) {

    Entity.call(this, x, y);
    this.sprite = sprDiabloIdle;
    this.glide = false;
    this.width = 128;
    this.height = 128;
    this.jumpKey = false;
    this.doubleJump = false;
    this.doubleJumpTime = $.now();
    this.powerUp = 0;
    this.powerUpTime = $.now();
    this.jumpPower = 10;
    this.maxhealth = 100;
    this.health = this.maxhealth;


}

Player.prototype = new Entity();
Player.prototype.constructor = Player;


Player.prototype.update = function () {
    this.color = "#0F0";

    if (this.powerUp == 1) {
        this.jumpPower = 30;
    } else {
        this.jumpPower = 10;
    }

    if (this.glide && this.gravity < -1) {
        this.gravity -= -1;
    } else {
        this.gravity -= 0.1;
    }

    //ANIMATIONS

    if (this.gravity < 0 && this.jump) {
        this.sprite = sprDiabloFall;
    }
    if (this.gravity > 0 && this.jump) {
        this.sprite = sprDiabloJump;
    }

    if (this.glide && this.gravity < 0) {
        this.sprite = sprDiabloGlide;
    }

    if (this.jump && this.powerUp && this.gravity > 0) {
        this.sprite = sprDiabloPowerup;
    }

    if (!this.jump) {
        this.sprite = sprDiabloIdle;
    }


    /* if (this.position.y - CAMy > 768) {
         this.jump = false;
         this.gravity = 0;
         this.position = new Vec2(this.position.x, 768);
     }*/

    // CAMx = (this.position.x + this.image.width / 2) - SCREEN_W / 2;
    CAMx = 0;
    if (this.position.y < CAMy + 319) {
        CAMy = (this.position.y + this.height / 2) - SCREEN_H / 2;
    }

    for (var i in clouds) {
        if (this.gravity < 0 && recsOverlap(this.position.x + 40, this.position.y + 70, 40, 58,
            clouds[i].position.x, clouds[i].position.y, clouds[i].width, clouds[i].height)) {
            if (this.position.y + (this.height - 12) < clouds[i].position.y) {
                this.position = new Vec2(this.position.x, clouds[i].position.y - this.height);
                this.gravity = 0;
                this.jump = false;
                this.doubleJump = false;

            }
        }
    }

    for (var i in souls) {
        if (recsOverlap(souls[i].position.x, souls[i].position.y, souls[i].width, souls[i].height,
              this.position.x + 40, this.position.y + 70, 40, 58)) {
            if (this.position.y + (this.height - 32) < souls[i].position.y) {
                this.jump = false;
                this.doubleJump = false;
                souls[i].static = false;
            }
        }
    }

    // Easteregg, muhAHA
    this.position = new Vec2(this.position.x, this.position.y - this.gravity);

    if (this.powerUpTime < $.now()) {
        this.powerUp = 0;
    }

    if (Key.isDown(Key.UP) && !this.jump) {
        this.jump = true;
        this.gravity = this.jumpPower;
        this.doubleJump = true;
        this.doubleJumpTime = $.now() + 1000;
    } else if (Key.isDown(Key.UP) && this.doubleJump && this.gravity > -1 && this.gravity < 1) {
        this.jump = true;
        this.doubleJump = false;
        this.gravity = this.jumpPower;

    }

    if (Key.isDown(Key.UP) && this.doubleJump && this.doubleJumpTime < $.now()) { this.doubleJump = false }

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

    if (CAMy < nextPowerUp) {

        var i = getRnd(0, clouds.length - 1);
        var x = getRnd(clouds[i].position.x, clouds[i].position.x + 128);
        var y = CAMy - 100;
        powerups.push(new PowerUp(x, y));

        nextPowerUp -= getRnd(1024, 4000);

    }

    if (CAMy < nextSegment) {

        var style = getRnd(0, 12);
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
                        var rnd = getRnd(2, 5);

                        i == 0 ? clouds.push(new Cloud(128, nextSegment - (j * 100), 1, rnd)) : clouds.push(new Cloud(1024 - 256, nextSegment - (j * 100), 1, rnd));
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
            default: //SCATTER
                for (var i = 0; i < 12; i++) {
                    var temp = getRnd(200, 800);

                    clouds.push(new Cloud(temp + (128 * (Math.sin(i / 0.01))), nextSegment - (i * 128), 1));
                }
                nextSegment -= 12 * 128;
                break;

        }

    }

};




