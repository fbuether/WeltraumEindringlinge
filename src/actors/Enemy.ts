import * as EventEmitter from "eventemitter3";

import {Team, TeamedActor} from "../actors/TeamedActor";
import {Actor} from "../engine/Actor";
import {Sprite, Effect} from "../engine/components/Sprite";
import {Engine} from "../engine/Engine";
import {Loader} from "../engine/Loader";
import {Body} from "../engine/components/Body";
import {Random} from "../engine/Random";

import {Bullet} from "../actors/Bullet";
import {Vector} from "../engine/Vector";
import {ShapeGenerator} from "../engine/ShapeGenerator";
import {Explosion} from "../actors/Explosion";


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

export class Enemy extends TeamedActor {
  private static readonly speed = [1.8, 2.4];
  private static readonly firingEnergy = 5000;
  private static readonly maxStartEnergy = 4000;
  private static readonly rate = [0.4, 1];

  public readonly events = new EventEmitter<Events>();

  private body: Body;

  private health: number = 5;
  private energy: number = 0;
  private readonly rate: number;
  private readonly speed: number;
  private readonly collisionDamage: number;

  private sprite: Sprite;

  public constructor(engine: Engine, position: Vector) {
    super("enemy", engine, Team.Enemy);

    this.body = new Body(engine, this, {
      shape: new ShapeGenerator().generateFromSpritesheet(
        engine, enemyTexture, "small-1"),
      position: position
    });
    this.body.events.on("collision", this.onCollision, this);
    this.add(this.body);

    this.sprite = new Sprite(engine, this, {
      kind: "animated",
      position: this.body,
      asset: enemyTexture,
      animation: "small",
      speed: 0.8,
      loops: true
    });
    this.add(this.sprite);

    this.energy = engine.random.int32(0, Enemy.maxStartEnergy);
    this.rate = engine.random.real(Enemy.rate[0], Enemy.rate[1]);
    this.speed = engine.random.real(Enemy.speed[0], Enemy.speed[1]);

    this.collisionDamage = 2;
  }

  public delete() {
    this.events.removeAllListeners();
  }


  public update(delta: number) {
    let movement = this.speed * delta / 1000;
    this.body.applyForce(new Vector(0, movement));

    if (!this.body.isOnScreen()) {
      this.events.emit("escaped", this);
      this.kill();
    }

    this.energy = this.energy + (delta * this.rate);
    if (this.energy >= Enemy.firingEnergy) {
      this.fire();
      this.energy -= Enemy.firingEnergy;
    }
  }


  private fire() {
    let point = this.body.position.clone()
      .add(new Vector(0, this.body.size.y / 2 + 20));

    this.engine.add(new Bullet(this.engine, {
      team: Team.Enemy,
      damage: 1,
      direction: new Vector(0, 0.006),
      position: point,
      sprite: {
        kind: "animated",
        asset: enemyTexture,
        animation: "glob",
        loops: true,
        speed: 0.4
      },
      shape: new ShapeGenerator().generateFromSpritesheet(
        this.engine, enemyTexture, "glob-1")
    }));
  }

  public damage(amount: number): boolean {
    let consume = this.alive;

    this.sprite.addEffect(Effect.FlashWhite);

    this.health -= amount;
    if (this.health <= 0) {
      this.events.emit("destroyed", this);
      this.engine.onNextUpdate(() => {
        this.kill();
        this.engine.add(new Explosion(this.engine, this.body.position));
      });
    }

    return consume;
  }

  public receivesBulletDamage() {
    return true;
  }

  private onCollision(other: Actor) {
    if (other instanceof TeamedActor && other.team != this.team) {
      other.damage(this.collisionDamage);
    }
  }
}
