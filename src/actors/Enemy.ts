
import {Actor} from "../engine/Actor";
import {Sprite} from "../engine/components/Sprite";
import {Engine} from "../engine/Engine";
import {Loader} from "../engine/Loader";
import {Body} from "../engine/components/Body";

import {Vector} from "../engine/Vector";
import {ShapeGenerator} from "../engine/ShapeGenerator";


let spriteTex = Loader.add(require("../../assets/images/3rd/alien1-1.png"));


export class Enemy extends Actor {
  private static readonly speed: number = 20;

  private body: Body;

  public constructor(engine: Engine, position: Vector) {
    super("enemy", engine);

    let sprite = new Sprite(engine, this, spriteTex);
    this.add(sprite);

    this.body = new Body(engine, this,
      new ShapeGenerator().generateFromTexture(sprite.texture), position);
    this.add(this.body);

    sprite.attachTo(this.body);
  }

  public update(delta: number) {
    let movement = Enemy.speed * delta / 1000;
    this.body.moveBy(new Vector(0, movement));

    if (!this.body.isOnScreen()) {
      // this.scene.looseGame();
      this.kill();
    }
  }
}


// import * as ex from "excalibur";

// import {Bullet} from "../actors/bullet";
// import {getAssets} from "../assets";
// import {Explosion} from "../actors/explosion";
// import {IncreaseScoreEvent} from "../actors/increase-score-event";

/*
export class Enemy extends ex.Actor {
  private static readonly speed: number = 20;
  private static readonly firingSpeed: number = 1000; // 1/s

  private onEnemyKilled: () => void;


  public constructor(onEnemyKilled: () => void) {
    super();
    this.onEnemyKilled = onEnemyKilled;
  }


  public onInitialize(engine: ex.Engine) {
    let anim = new ex.Animation({
      engine: engine,
      loop: true, speed: 900,
      sprites: getAssets().enemy1
    });

    this.addDrawing("generic", anim);
    this.width = 30;
    this.height = 30;
    this.body.collider.type = ex.CollisionType.Active;
  }


  public onPreKill() {
    let explosion = new Explosion();
    explosion.pos = this.pos;
    this.scene.add(explosion);

    this.onEnemyKilled();
  }


  public onPostUpdate(engine: ex.Engine, delta: number) {
    let movement = Enemy.speed * delta / 1000;
    this.pos = this.pos.add(new ex.Vector(0, movement));

    // if below the screen
    if (this.isOffScreen && this.pos.y > 0) {
      this.kill();
    }
  }
}
*/
