// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

var EnemyState = cc.Enum({
    Run: -1,
    Dead: -1,
});

cc.Class({
    extends: cc.Component,

    properties: {
        greedBar: cc.Node,
        name: "enemy1",
        speed: 0,
        maxHp :200,
        hp: 200,
        state: EnemyState,
    },
    statics: {
        EnemyState
    },
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },
    init(enemyInfo) {
        this.state = EnemyState.Run;
        this.speed = enemyInfo.speed;
    },
    hurt(damage) {
        if (this.hp <= damage) {
            this.hp = 0;
            this.state = EnemyState.Dead;
        }
        else this.hp -= damage;
        this.greedBar.scaleX = this.hp / this.maxHp;
    },
    isDead() {
        return this.state == EnemyState.Dead;
    },
    move(dt) {
        // cc.log(this.speed);
        // cc.log(this.node.x);
        // cc.log(this.node.y);
        this.node.x -= this.speed * dt;
    },
    getWordPosition() {

    },
    // update (dt) {},
});
