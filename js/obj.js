function Cloud(x, y, type) {

    Entity.call(this, x, y);
    this.image = imgWolke;
    this.cloudType = type; //0 static //1 temp
    this.width = 128;
    this.height = 32;

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


function Angel(x, y,speed) {

    Entity.call(this, x, y);
    this.image = imgAngel;
    this.offsetY = y;
    this.speed = speed;
    this.width = 128;
    this.height = 128;

}
Angel.prototype = new Entity();
Angel.prototype.constructor = Angel;


Angel.prototype.update = function () {

    var X,Y;

    X = this.position.x + this.speed;
    Y = (Math.sin(X / 250) * 200) + this.offsetY;

    this.position = new Vec2(X, Y);

    if (this.position.x > 1150 || this.position.x < -100) {
        this.active = false;
    }
}