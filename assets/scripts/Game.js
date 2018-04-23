
var Enemy = require('Enemy')
var Definer = require('Definer')
var Bullet = require('Bullet')

var GameState = cc.Enum({
    Init: -1,
    Start: -1,
    Run: -1,
    Pause: -1,
    Over: -1,
});

cc.Class({
    extends: cc.Component,

    properties: {
        moveLayer: cc.Node,
        objectLayer: cc.Node,
        bulletLayer: cc.Node,
        defineArea: cc.Node,
        enemyBuild: cc.Node,

        enemys: {
            default: [],
            type: [Enemy]   // 用 type 指定数组的每个元素都是字符串类型
        },
        enemyGoalX: -1,

        definers: {
            default: [],
            type: [Definer]
        },

        healthLabel:cc.Label,
        health:20,        
    },
    statics: {
        GameState
    },

    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        
    },
    initDeiners() {
        var info = {
            x: 0,
            x: 0,
            range: 900,
            coolDown: 0.5,
            bulletInfo: {
                speed: 600,
            }
        };
        this.definers.push(
            this.buildOneDefiners(info)
        );
    },
    buildOneDefiners(definerInfo) {
        var d = G.om.newDefiner();
        var defineAreaPos = this.defineArea.getPosition();
        cc.log("add definer");
        cc.log(defineAreaPos);
        d.init(definerInfo, this.bulletLayer);
        this.objectLayer.addChild(d.node);
        var layerPos = defineAreaPos.add(cc.v2(definerInfo.x, definerInfo.y))
        cc.log(layerPos);
        d.node.setPosition(layerPos);
        return d;
    },
    start() {
        this.initDeiners();
        this.state = GameState.Run;
        this.enemyGoalX = this.defineArea.x + this.defineArea.width/2;
        this.setHealth(this.health);
        this.buildEnemys();
    },

    update(dt) {
        if (this.state == GameState.Run) {
            // //build enemys
            
            // //移动物体
            this.enemysMove(dt);
            this.bulletsMove(dt);
            //处理所有的碰撞，扣血
            this.dealHit(dt);
            //检测敌人死亡
            this.enemysDead();
            //发射子弹
            this.definersFight(dt);
            //检测敌人是否到达阵地
            this.enemysReach(dt);
        }
    },
    buildEnemys() {
        for(var i =0;i<5;i++){
            var enemyInfo = {
                x: 0,
                y: -200 + 100 * i,
                speed: 300,
                hp: Math.random() * 300,
            };
            this.enemys.push(this.buildOneEnemy(enemyInfo));
        }
    },
    buildOneEnemy(enemyInfo) {
        var e = G.om.newEnemy();
        e.init(enemyInfo);
        var enemyBuildPos = this.enemyBuild.getPosition();
        this.objectLayer.addChild(e.node);
        e.node.setPosition(enemyBuildPos.add(cc.v2(enemyInfo.x, enemyInfo.y)));
        return e;
    },
    enemysMove(dt) {
        // cc.log(this.enemys.length);
        for (var i in this.enemys) {
            // cc.log("move enemy")
            var one = this.enemys[i];
            one.move(dt);
        };
    },
    //处理所有的碰撞，扣血
    bulletsMove(dt) {
        for (var i in this.definers) {
            var one = this.definers[i];
            one.bulletsMove(dt);
        };
    },
    dealHit() {
        for (var i in this.definers) {
            var one = this.definers[i];
            one.bulletsHit();
        }
    },
    //检测敌人死亡
    enemysDead() { 
        var newArr = [];
        for(var i in this.enemys){
            var one = this.enemys[i];
            if(one.isDead()){
                one.playDead();
            }
            else{
                newArr.push(one);
            }
        }
        this.enemys = newArr;
    },
    //发射子弹
    definersFight(dt) {
        for (var i in this.definers) {
            var one = this.definers[i];
            // var targetEnemy = 
            one.fightAnyEnemys(this.enemys, dt);
            // if (targetEnemy != null) {
            //     var bullet = one.buildBullet();
            //     this.bullets.push(bullet);
            //     this.bulletLayer.addChild(bullet.node);
            // }
        }
    },
    //检测敌人是否到达阵地
    enemysReach() {
        var newArr = [];
        for (var i in this.enemys) {
            var one = this.enemys[i];
            var v = one.node.getPosition();
            if( v.x <= this.enemyGoalX ){
                one.reach();
                this.subHealth(1);
            }
            else{
                newArr.push(one);
            }
        }
        this.enemys = newArr;
    },

    //health control
    setHealth(h){
        this.health = h;
        this.healthLabel.string = "+"+this.health;
    },
    addHealth(h){
        this.health += h;
        this.healthLabel.string = "+"+this.health;
    },
    subHealth(h){
        this.health -= h;
        this.healthLabel.string = "+"+this.health;
    },
});
