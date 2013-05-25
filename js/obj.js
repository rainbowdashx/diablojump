function Cloud(x, y, type) {

    Entity.call(this, x, y);
    this.image = imgWolke;
    this.cloudType = type; //0 static //1 temp

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