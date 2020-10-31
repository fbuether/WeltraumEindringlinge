
import {Team, TeamedActor} from "../actors/TeamedActor";
import {Actor} from "../engine/Actor";
import {Body} from "../engine/components/Body";
import {Engine} from "../engine/Engine";
import {Loader} from "../engine/Loader";
import {Sprite} from "../engine/components/Sprite";

import {Vector} from "../engine/Vector";
import {ShapeGenerator} from "../engine/ShapeGenerator";


let texture = Loader.addSpritesheet(
  require("../../assets/images/bullet.png"), {
    frames: {
      "bullet-1": { frame: {x: 3, y: 3, w: 6, h: 21 } },
      "bullet-2": { frame: {x: 15, y: 3, w: 6, h: 21 } },
      "bullet-3": { frame: {x: 27, y: 3, w: 6, h: 21 } }
    },
    animations: {
      "bullet": ["bullet-1", "bullet-2", "bullet-3"]
    }
  });


interface BulletConfig {
  team: Team;
  position: Vector;
  direction: Vector;
  damage: number;
}


export class Bullet extends TeamedActor {
  private body: Body;
  private _damage: number = 0;

  public constructor(engine: Engine, config: BulletConfig) {
    super("bullet", engine, config.team);

    this._damage = config.damage;

    this.body = new Body(engine, this, {
      shape: new ShapeGenerator().generateFromSpritesheet(
        engine, texture, "bullet-1"),
      position: config.position,
      isBullet: true,
      damping: 0
    });


    this.body.applyForce(config.direction);

    this.body.onCollision(this.onCollision.bind(this));

    this.add(this.body);
    this.add(new Sprite(engine, this, {
      kind: "animated",
      asset: texture,
      position: this.body,
      animation: "bullet",
      speed: 0.333,
      loops: true
    }));
  }

  private onCollision(other: Actor) {
    if (other instanceof TeamedActor && other.team != this.team) {
      let consumed = other.damage(this._damage);
      if (consumed) {
        this.kill();
      }
    }
    else {
      // unceremoniously kill ourselves for now.
      this.kill();
    }
  }

  public damage(amount: number): boolean {
    // bullets do not get damaged.
    return false;
  }

  public update(delta: number) {
    if (!this.body.isOnScreen()) {
      this.kill();
    }
  }
}
