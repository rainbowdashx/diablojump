function Cloud(x, y) {

    Entity.call(this, x, y);
    this.image = imgWolke;

}
Cloud.prototype = new Entity();
Cloud.prototype.constructor = Cloud;


Cloud.prototype.update = function () {

    if (this.position.y > CAMy + 768) {

       
        this.position = new Vec2(getRnd(0, 1024), getRnd(CAMy, CAMy - 768));
    }
}