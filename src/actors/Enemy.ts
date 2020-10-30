import * as EventEmitter from "eventemitter3";

import {Actor} from "../engine/Actor";
import {Sprite} from "../engine/components/Sprite";
import {Engine} from "../engine/Engine";
import {Loader} from "../engine/Loader";
import {Body} from "../engine/components/Body";
import {Random} from "../engine/Random";

import {Vector} from "../engine/Vector";
import {ShapeGenerator} from "../engine/ShapeGenerator";
import {Explosion} from "../actors/Explosion";


let texture = Loader.addSpritesheet(
  require("../../assets/images/3rd/SpaceInvaders-3.png"), {
    frames: {
      "alien-1-1": { frame: {x:  9, y:  12, w: 33, h: 24 } },
      "alien-2-1": { frame: {x: 12, y:  60, w: 24, h: 24 } },
      "alien-3-1": { frame: {x: 12, y: 108, w: 27, h: 24 } },
      "alien-4-1": { frame: {x: 12, y: 156, w: 24, h: 24 } }
    }
  });


let enemyTexture = Loader.addSpritesheet(
  require("../../assets/images/enemies.png"), {
    frames: {
      "small-1": { frame: {x: 0, y: 0, w: 72, h: 48 } },
      "small-2": { frame: {x: 75, y: 0, w: 72, h: 48 } },
      "glob-1": { frame: {x: 0, y: 49, w: 24, h: 36 } },
      "glob-2": { frame: {x: 27, y: 49, w: 24, h: 36 } }
    },
    animations: {
      "small": [ "small-1", "small-2" ],
      "glob": [ "glob-1", "glob-2" ]
    }
  });


type Events = "destroyed" | "escaped";

export class Enemy extends Actor {
  private static readonly speed: number = 20;

  public readonly events = new EventEmitter<Events>();

  private body: Body;

  public constructor(engine: Engine, position: Vector) {
    super("enemy", engine);

    let n = engine.random.fork().int32(1, 4);
    let sprite = new Sprite(engine, this, texture, "alien-" + n + "-1");
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
      this.events.emit("escaped", this);
      this.kill();
    }
  }

  public kill() {
    this.engine.add(new Explosion(this.engine, this.body.position));
    this.events.emit("destroyed", this);
    super.kill();
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
