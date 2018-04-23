var Bullet = require('Bullet')
var Enemy = require('Enemy')

cc.Class({
    extends: cc.Component,

    properties: {
        name : "definer1",
        photo: cc.Node,
        rangeMask: cc.Node,

        bulletPrefab: cc.Prefab,
        bulletInfo:null,
        
        bullets: {
            default: [],
            type: [Bullet]
        },
        bulletLayer: cc.Node,

        range: 600,
        coolDown: 1,
        coolDownTime:0,
    },

    init(definerInfo, bulletLayer) {
        this.range = definerInfo.range;
        this.coolDown = definerInfo.coolDown;
        this.coolDownTime = 0;
        this.bulletInfo = definerInfo.bulletInfo;
        this.bulletLayer = bulletLayer;
        cc.log('init Definer');
        this.rangeMask.width = this.range * 2;
        this.rangeMask.height = this.range * 2;
    },
    bulletsMove(dt){
        for(var i in this.bullets){
            var one = this.bullets[i];
            one.move(dt);
        }
    },
    buildBullet(targetEnemy) {
        let bullet = null;
        if(cc.pool.hasObject(Bullet)){
            bullet = cc.pool.getFromPool(Bullet);
        }
        else{
            bullet = cc.instantiate(this.bulletPrefab).getComponent(Bullet);
        }
        bullet.init(this.bulletInfo, targetEnemy);
        this.bullets.push(bullet);
        bullet.node.active = true;
        this.bulletLayer.addChild(bullet.node);
        var mypos = this.node.getPosition();
        bullet.node.setPosition(mypos);
        bullet.rotationToTarget();
        
    },
    bulletsHit(){
        var newBullets = [];
        for(var i in this.bullets){
            var one = this.bullets[i];
            var isHit = one.isHit();
            if(isHit){
                var isDead = one.damageEnemy();
                cc.log("deinfer "+ this.name+" kill "+one.targetEnemy.name)
                one.afterHit();
            }
            if( one.isOver() ){
                one.node.active = false;
                one.node.removeFromParent();
                cc.pool.putInPool(one);
            }
            else{
                newBullets.push(one);
            }
        }
        this.bullets = newBullets;
    },
    getWorldSpace() {

    }, 
    fightAnyEnemys(enemys, dt){
        if( this.coolDownTime <= 0 ){
            var mypos = this.node.getPosition();
            // cc.log(mypos);
            var minDistinct = -1;
            var targetEnemy = null;
            for(var i in enemys){
                var one =  enemys[i];
                var enemyPos = one.node.getPosition();
                cc.log(enemyPos);
                var distinct = mypos.sub(enemyPos).mag();
                if( distinct <= this.range){
                    cc.log("find enemy");
                    if( minDistinct <0 || distinct < minDistinct ){
                        minDistinct = distinct;
                        targetEnemy = one;
                    }
                }
            }
            if( targetEnemy != null ){
                this.coolDownTime = this.coolDown; 
                this.buildBullet(targetEnemy);
            }
        }
        else this.coolDownTime -= dt;
    },

    update(dt) {

    },
});
