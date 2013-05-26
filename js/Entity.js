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
    this.damaged = false;
    this.damagedTimer = $.now();
    this.health = this.maxhealth;
    this.maxstamina = 100;
    this.stamina = this.maxstamina;

    this.staminaTimer = $.now();

    this.boxX = 40;
    this.boxY = 40;
    this.boxH = 60;
    this.boxW = 45;

    this.score = 0;

    this.oldJump = false;



}

Player.prototype = new Entity();
Player.prototype.constructor = Player;


Player.prototype.update = function () {
    this.color = "#0F0";

    if (!Key.isDown(Key.UP)) {
        this.oldJump = false
    }


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

    if (this.glide) {
        this.sprite = sprDiabloGlide;
    }

    if (this.jump && this.gravity > 10) {
        this.sprite = sprDiabloPowerup;
    }

    if (!this.jump) {
        this.sprite = sprDiabloIdle;
    }

    if (this.damaged) {
        this.sprite = sprDiabloHit;
    }
    // ANIMATIONS


    // CAMx = (this.position.x + this.image.width / 2) - SCREEN_W / 2;
    CAMx = 0;
    if (this.position.y < CAMy + 319) {
        CAMy = (this.position.y + this.height / 2) - SCREEN_H / 2;
    }

    for (var i in clouds) {
        if (this.gravity < 0 && recsOverlap(this.position.x + this.boxX, this.position.y + this.boxY, this.boxW, this.boxH,
            clouds[i].position.x, clouds[i].position.y, clouds[i].width, clouds[i].height)) {
            if (this.position.y + (100 - 12) < clouds[i].position.y) {
                this.position = new Vec2(this.position.x, clouds[i].position.y - (this.height - 28));
                this.gravity = 0;
                this.jump = false;
                this.doubleJump = false;
            }
        }
    }

    for (var i in souls) {
        if (recsOverlap(souls[i].position.x, souls[i].position.y, souls[i].width, souls[i].height,
             this.position.x + this.boxX, this.position.y + this.boxY, this.boxW, this.boxH)) {
            if (this.position.y + (this.height - 32) < souls[i].position.y) {
                this.jump = false;
                this.doubleJump = false;
                souls[i].static = false;
                this.score += 50;
                this.health += 10;

            }
        }
    }

    for (var i in angels) {

        if (recsOverlap(angels[i].position.x, angels[i].position.y, angels[i].width, angels[i].height,
           this.position.x + this.boxX, this.position.y + this.boxY, this.boxW, this.boxH)) {
            this.takeDmg(10);
            this.damaged = true;
            this.damagedTimer = $.now() + 500;
        }
    }

    // Easteregg, muhAHA
    this.position = new Vec2(this.position.x, this.position.y - this.gravity);

    if (this.damagedTimer < $.now()) {
        this.damaged = false;
    }

    if (this.staminaTimer < $.now()) {
        this.stamina += 1;
    }
    if (this.stamina > this.maxstamina) {
        this.stamina = this.maxstamina;
    }
     if (this.health > this.maxhealth) {
         this.health = this.maxhealth;
    }
    //INPUT
    if (this.active) {
        if (Key.isDown(Key.UP) && !this.jump) {
            this.jump = true;
            this.powerUp = 0;
            this.gravity = this.jumpPower;
            this.doubleJump = true;
            this.doubleJumpTime = $.now() + 1000;
            this.score += 60;

        }

        if (Key.isDown(Key.UP) && this.gravity < 0 && this.doubleJumpTime < $.now() && !this.oldJump && this.stamina > 9) {
            this.gravity += 2;
            this.glide = true;
            if (this.glideTime < $.now()) {
                this.stamina -= 10;
            }
            this.glideTime = $.now() + 100;
            this.doubleJumpTime = $.now() + 100;
            this.oldJump = true;
            this.score += 1;
            this.staminaTimer = $.now() + 5000;
        }

        if (Key.isDown(Key.UP) && this.gravity < -1 && this.jump) {
            this.gravity = -1;
            this.glide = true;
            this.glideTime = $.now() + 100;
            this.doubleJumpTime = $.now() + 100;
            this.oldJump = true;

        }
        if (Key.isDown(Key.LEFT)) {
            this.position = new Vec2(this.position.x - 5, this.position.y);
        }

        if (Key.isDown(Key.RIGHT)) {
            this.position = new Vec2(this.position.x + 5, this.position.y);
        }
    }
    //INPUT
    if (this.glideTime < $.now()) {
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

   if (this.position.y - CAMy > 2000) {
        this.active = false;
        this.sprite = sprDiabloDeath;
    }

    if (this.health <= 0) {
        this.sprite = sprDiabloDeath;
        this.active = false;
    }

};




