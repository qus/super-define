
var Enemy = require('Enemy')
var Definer = require('Definer')
var Bullet = require('Bullet')

cc.Class({
    extends: cc.Component,

    properties: {
        bulletPrefab: cc.Prefab,
        enemyPrefab: cc.Prefab,
        definerPrefab: cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        G.om = this;
    },

    newDefiner(){
        return cc.instantiate(this.definerPrefab).getComponent(Definer);
    },
    returnDefiner(definer){
        cc.pool.putInPool(definer);
    },
    newBullet(){
        var bullet = null;
        if(cc.pool.hasObject(Bullet)){
            bullet = cc.pool.getFromPool(Bullet);
        }
        else{
            bullet = cc.instantiate(this.bulletPrefab).getComponent(Bullet);
        }
        return bullet;
    },
    returnBullet(bullet){
        cc.pool.putInPool(bullet);
    },
    newEnemy(){
        var enemy = null;
        if(cc.pool.hasObject(Enemy)){
            enemy = cc.pool.getFromPool(Enemy);
        }
        else{
            enemy = cc.instantiate(this.enemyPrefab).getComponent(Enemy);
        }
        return enemy;
    },
    returnEnemy(enemy){
        cc.pool.putInPool(enemy);
    },

    // update (dt) {},
});
