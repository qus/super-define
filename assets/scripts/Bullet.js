var Enemy = require('Enemy')

var BulletState = cc.Enum({
    Run: -1,
    Over: -1,
});

cc.Class({
    extends: cc.Component,

    properties: {
        speed: 600,
        hitDistinct: 50,
        targetEnemy: Enemy,
        damage: 100,
        state:BulletState,
    },
    statics: {
        BulletState
    },

    init(bulletInfo, targetEnemy){
        this.state = BulletState.Run;
        this.speed = bulletInfo.speed;
        this.targetEnemy = targetEnemy;
    },
    move(dt){
        var oldPosition = this.node.getPosition();
        var targetPos = this.targetEnemy.node.getPosition();
        var addVector = targetPos.sub(oldPosition).normalizeSelf().mulSelf(this.speed * dt);
        this.node.setPosition(oldPosition.add(addVector));
        this.rotationToTarget();
    },

    rotationToTarget(){
        var mypos = this.node.getPosition();
        var targetV = this.targetEnemy.node.getPosition().sub(mypos);
        var degress = cc.radiansToDegrees(targetV.angle(cc.v2(0,1)));
        this.node.rotation = degress;
    },

    isHit(){
        if( !this.targetEnemy.isDead()){
            var mypos = this.node.getPosition();
            var targetV = this.targetEnemy.node.getPosition();
            var distinct = targetV.sub(mypos).mag();
            var isHit = false;
            var damage = 0;
            return distinct < this.hitDistinct;
        }
        else{
            this.state = BulletState.Over;
        }
    },

    damageEnemy(){
        this.targetEnemy.hurt(this.damage);
    },

    afterHit(){
        this.state = BulletState.Over;
    },
    
    isOver(){
        return this.state == BulletState.Over;
    }
});
