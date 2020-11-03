
import {Team, TeamedActor} from "../actors/TeamedActor";
import {Actor} from "../engine/Actor";
import {Body} from "../engine/components/Body";
import {Engine} from "../engine/Engine";
import {Loader} from "../engine/Loader";
import {Sprite, SpriteConfig} from "../engine/components/Sprite";
import {DistributiveOmit} from "../Types";

import {Vector} from "../engine/Vector";
import {ShapeGenerator} from "../engine/ShapeGenerator";
import {Shape as planckShape} from "planck-js/lib/shape/index";



export interface BulletConfig {
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

    this.body.events.on("collision", this.onCollision, this);

    this.add(this.body);
    this.add(new Sprite(engine, this, {
      ...config.sprite,
      position: this.body
    }));
  }

  public receivesBulletDamage() {
    return false;
  }

  private onCollision(other: Actor) {
    if (other instanceof TeamedActor && other.team != this.team) {
      if (other.receivesBulletDamage()) {
        other.damage(this._damage);
      }
    }
  }

  public damage(amount: number): boolean {
    if (amount > 0) {
      this.engine.onNextUpdate(() => {
        this.kill();
      });
    }

    return (amount <= 1);
  }

  public update(delta: number) {
    if (!this.body.isOnScreen()) {
      this.kill();
    }
  }
}
