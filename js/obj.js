function Cloud(x, y, type, size) {

    Entity.call(this, x, y);
    this.image = imgWolke;
    this.cloudType = type; //0 static //1 temp
    this.width = 128;
    this.height = 32;
    this.size = size || 4;

}
Cloud.prototype = new Entity();
Cloud.prototype.constructor = Cloud;


Cloud.prototype.update = function () {

    if (this.position.y > CAMy + 768) {

        if (this.cloudType == 1) {
            this.active = false;
        } else if (this.cloudType == 0) {
            this.position = new Vec2(getRnd(0, 1024), getRnd(CAMy, CAMy - 768));
        }
    }
}



function Angel(x, y, speed) {

    Entity.call(this, x, y);
    this.sprite = sprAngel;
    this.offsetY = y;
    this.speed = speed;
    this.width = 128;
    this.height = 128;

}
Angel.prototype = new Entity();
Angel.prototype.constructor = Angel;


Angel.prototype.update = function () {

    this.sprite.update(dt);

    var X, Y;

    X = this.position.x + this.speed;
    Y = (Math.sin(X / 250) * 200) + this.offsetY;

    this.position = new Vec2(X, Y);


    if (recsOverlap(this.position.x, this.position.y, this.width, this.height,
           player.position.x + 40, player.position.y + 70, 40, 58)) {
        player.takeDmg(10);
    }

    if (this.position.x > 1150 || this.position.x < -100) {
        this.active = false;
    }
}


function PowerUp(x, y) {
    Entity.call(this, x, y);
    this.image = imgPowerup;
    this.width = 32;
    this.height = 32;
    this.static = false;

}

PowerUp.prototype = new Entity();
PowerUp.prototype.constructor = PowerUp;


PowerUp.prototype.update = function () {



    if (!this.static) {
        this.gravity -= 0.1;
        this.position = new Vec2(this.position.x, this.position.y - this.gravity);
    }

    for (var i in clouds) {

        if (recsOverlap(this.position.x, this.position.y, this.width, this.height,
                clouds[i].position.x, clouds[i].position.y, clouds[i].width, clouds[i].height)) {

            this.position.y = clouds[i].position.y - 32;
            this.static = true;
        }
    }

    if (recsOverlap(this.position.x, this.position.y, this.width, this.height,
           player.position.x + 40, player.position.y + 70, 40, 58)) {
        this.active = false;
        player.powerUp = 1;
        player.powerUpTime = $.now() + 15000;
    }

    if (this.position.y > CAMy + 1000) {

        this.active = false;
    }
}



function Soul(x, y) {

    Entity.call(this, x, y);
    this.image = imgSoul;
    this.width = 64;
    this.height = 128;
    this.static = true;
    this.offsetX = x;
    this.speed = -5;

}


Soul.prototype = new Entity();
Soul.prototype.constructor = Soul;


Soul.prototype.update = function () {

    if (!this.static) {
        this.gravity -= 0.1;
        this.position = new Vec2(this.position.x, this.position.y - this.gravity);
    }

    if (this.static) {
        var X, Y;

        Y = this.position.y + this.speed;
        X = (Math.sin(Y / 250) * 200) + this.offsetX;

        this.position = new Vec2(X, Y);
    }

  
    if (this.position.y > CAMy + 2000 || this.position.y < CAMy - 500) {

        this.active = false;
    }
}
