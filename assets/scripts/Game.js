
var Enemy = require('Enemy')
var Definer = require('Definer')
var Bullet = require('Bullet')

var GameState = cc.Enum({
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
        enemyPrefab: cc.Prefab,
        enemyEnd: -500,

        definers: {
            default: [],
            type: [Definer]
        },
        definerPrefab: cc.Prefab,

        state: GameState,
    },
    statics: {
        GameState
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.initDeiners();
    },
    initDeiners() {
        var info = {
            x: 0,
            x: 0,
            range: 600,
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
        var d = cc.instantiate(this.definerPrefab).getComponent(Definer);
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
        var enemyInfo = {
            x: 0,
            y: 100,
            speed: 300,
        };
        this.enemys.push(this.buildOneEnemy(enemyInfo));
        this.state = GameState.Run;
    },

    update(dt) {
        if (GameState.Run) {
            // //build enemys
            // this.buildEnemys();
            // //移动物体
            this.enemysMove(dt);
            this.bulletsMove(dt);
            //处理所有的碰撞，扣血
            this.dealHit(dt);
            //检测敌人死亡
            this.enemysDead();
            //发射子弹
            this.definersFight();
            //检测敌人是否到达阵地
            this.enemysReach();
        }
    },
    buildEnemys() {

    },
    buildOneEnemy(enemyInfo) {
        var e = cc.instantiate(this.enemyPrefab).getComponent(Enemy);
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
    enemysDead() { },
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
        for (var i in this.enemys) {
            var one = this.enemys[i];
            var v = one.getWordPosition();
            // if( v.x <= this.enemyEnd ){
            //     one.reach();
            // }
        }
    },
});
