
import {Team, TeamedActor} from "../actors/TeamedActor";
import {Actor} from "../engine/Actor";
import {Body} from "../engine/components/Body";
import {Engine} from "../engine/Engine";
import {Loader} from "../engine/Loader";
import {Sprite, SpriteConfig} from "../engine/components/Sprite";

import {Vector} from "../engine/Vector";
import {ShapeGenerator} from "../engine/ShapeGenerator";
import {Shape as planckShape} from "planck-js/lib/shape/index";


type DistributiveOmit<T, K extends keyof any> = T extends any
  ? Omit<T, K>
  : never;

interface BulletConfig {
  team: Team;
  position: Vector;
  direction: Vector;
  damage: number;

  shape: planckShape;
  sprite: DistributiveOmit<SpriteConfig, "position">;
}


export class Bullet extends TeamedActor {
  private body: Body;
  private _damage: number = 0;

  public constructor(engine: Engine, config: BulletConfig) {
    super("bullet", engine, config.team);

    this._damage = config.damage;

    this.body = new Body(engine, this, {
      shape: config.shape,
      position: config.position,
      isBullet: true,
      damping: 0
    });


    this.body.applyForce(config.direction);

    this.body.onCollision(this.onCollision.bind(this));

    this.add(this.body);
    this.add(new Sprite(engine, this, {
      ...config.sprite,
      position: this.body
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
