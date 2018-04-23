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
    Init:-1,
    Run: -1,
    Dead: -1,
});

cc.Class({
    extends: cc.Component,

    properties: {
        greedBar: cc.Node,
        enemyName: "enemy1",
        speed: 0,
        maxHp :200,
        hp: 200,
    },
    statics: {
        EnemyState
    },
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    init(enemyInfo) {
        this.state = EnemyState.Run;
        this.speed = enemyInfo.speed;
        this.hp = enemyInfo.hp;
        this.maxHp = enemyInfo.hp;
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
    playDead(){
        var anim = this.node.getComponent(cc.Animation);
        anim.play("EnemyDead");
    },
    display(){
        this.node.removeFromParent();
        G.om.returnEnemy(this);
    },
    reach(){
        var anim = this.node.getComponent(cc.Animation);
        anim.play("EnemyReach");
        this.state = EnemyState.Dead;
    },
    
    move(dt) {
        // cc.log(this.speed);
        // cc.log(this.node.x);
        // cc.log(this.node.y);
        if( this.state === EnemyState.Run){
            this.node.x -= this.speed * dt;
        }
    },
    getWordPosition() {

    },
    // update (dt) {},
});
