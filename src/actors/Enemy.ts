import * as EventEmitter from "eventemitter3";

import {Team, TeamedActor} from "../actors/TeamedActor";
import {Actor} from "../engine/Actor";
import {Sprite, Effect, SpriteConfig} from "../engine/components/Sprite";
import {Engine} from "../engine/Engine";
import {Loader, AssetTag} from "../engine/Loader";
import {Body} from "../engine/components/Body";
import {Random} from "../engine/Random";
import {DistributiveOmit} from "../Types";
import {Bullet} from "../actors/Bullet";
import {Vector} from "../engine/Vector";
import {ShapeGenerator} from "../engine/ShapeGenerator";
import {Explosion, ExplosionSize} from "../actors/Explosion";



let enemySmallTexture = Loader.addSpritesheet(
  require("../../assets/images/enemy-small.png"), {
    frames: {
      "1": { frame: {x: 0 * 12, y: 0 * 15, w: 12, h: 15} },
      "2": { frame: {x: 1 * 12, y: 0 * 15, w: 12, h: 15} },
      "3": { frame: {x: 0 * 12, y: 1 * 15, w: 12, h: 15} },
      "4": { frame: {x: 1 * 12, y: 1 * 15, w: 12, h: 15} }
    },
    animations: {
      "ship": ["1", "2", "3", "4"]
    }
  });

let fighterFrontTexture = Loader.addSpritesheet(
  require("../../assets/images/enemy-fighter-front.png"), {
    frames: {
      "eff1": {frame: {x:  0, y:  0, w: 23, h: 19} },
      "eff2": {frame: {x: 23, y:  0, w: 23, h: 19} },
      "eff3": {frame: {x:  0, y: 19, w: 23, h: 19} },
      "eff4": {frame: {x: 23, y: 19, w: 23, h: 19} } },
    animations: {
      "eff": ["eff1", "eff2", "eff3", "eff4"] }});

let fighterBackTexture = Loader.addSpritesheet(
  require("../../assets/images/enemy-fighter-back.png"), {
    frames: {
      "efb1": {frame: {x:  0, y:  0, w: 25, h: 20} },
      "efb2": {frame: {x: 25, y:  0, w: 25, h: 20} },
      "efb3": {frame: {x:  0, y: 20, w: 25, h: 20} },
      "efb4": {frame: {x: 25, y: 20, w: 25, h: 20} } },
    animations: {
      "efb": ["efb1", "efb2", "efb3", "efb4"] }});

let enemyBomberTexture = Loader.addSpritesheet(
  require("../../assets/images/enemy-bomber.png"), {
    frames: {
      "ship-1": {frame: {x:  0, y:  0, w: 24, h: 21} },
      "ship-2": {frame: {x: 24, y:  0, w: 24, h: 21} },
      "ship-3": {frame: {x:  0, y: 21, w: 24, h: 21} },
      "ship-4": {frame: {x: 24, y: 21, w: 24, h: 21} }
    },
    animations: {
      "ship": ["ship-1", "ship-2", "ship-3", "ship-4"]
    }
  });

let bulletTexture = Loader.addSpritesheet(
  require("../../assets/images/enemy-bullet.png"), {
    frames: {
      "bomb-1":   {frame: {x:  0, y:  0, w: 8, h: 12} },
      "bomb-2":   {frame: {x:  8, y:  0, w: 8, h: 12} },
      "bullet-1": {frame: {x:  0, y: 12, w: 3, h:  6} },
      "bullet-2": {frame: {x:  8, y: 12, w: 3, h:  6} } },
    animations: {
      "bomb": ["bomb-1", "bomb-2"],
      "bullet": ["bullet-1", "bullet-2"] }});





const hitSounds = [
  Loader.addSound(require("../../assets/sounds/hit-1.wav.opus")),
  Loader.addSound(require("../../assets/sounds/hit-2.wav.opus")),
  Loader.addSound(require("../../assets/sounds/hit-3.wav.opus"))
];


const shootSound = Loader.addSound(
  require("../../assets/sounds/enemy-shoot.wav.opus"));


interface EnemySpec {
  health: number;
  speed: [number, number];
  collisionDamage: number;

  sprite: DistributiveOmit<SpriteConfig, "position">;
  body: {
    asset: AssetTag;
    sprite: string;
    scale: Vector;
  };
  bullet: null | {
    maxStartEnergy: number;
    firingEnergy: number;
    rechargeRate: [number, number];

    position: Array<Vector>;
    speed: number;

    damage: number;
    sprite: DistributiveOmit<SpriteConfig, "position">;
    body: {
      asset: AssetTag;
      sprite: string;
      scale: Vector;
    };
  };

  explosionSize: ExplosionSize;
};


export enum EnemyClass {
  Small,
  FighterFront,
  FighterBack,
  Bomber
}


let enemies: Record<EnemyClass, EnemySpec> = {
  [EnemyClass.Small]: {
    health: 1,
    speed: [6, 8.5],
    collisionDamage: 3,

    sprite: {
      kind: "animated",
      asset: enemySmallTexture,
      animation: "ship",
      scale: new Vector(3, 3),
      speed: 0.45
    },
    body: {
      asset: enemySmallTexture,
      sprite: "1",
      scale: new Vector(3, 3)
    },
    bullet: null,
    explosionSize: ExplosionSize.Small
  },

  [EnemyClass.FighterFront]: {
    health: 4,
    speed: [2.4, 3.4],
    collisionDamage: 2,

    sprite: {
      kind: "animated",
      asset: fighterFrontTexture,
      animation: "eff",
      scale: new Vector(3, 3),
      speed: 0.7
    },
    body: {
      asset: fighterFrontTexture,
      sprite: "eff1",
      scale: new Vector(3, 3)
    },
    bullet: {
      maxStartEnergy: 4500,
      firingEnergy: 5000,
      rechargeRate: [0.85, 1],

      position: [new Vector(0, 12)],
      speed: 0.011,

      damage: 1,
      sprite: {
        kind: "animated",
        asset: bulletTexture,
        animation: "bullet",
        scale: new Vector(3, 3),
        speed: 0.35
      },
      body: {
        asset: bulletTexture,
        sprite: "bullet-1",
        scale: new Vector(3, 3)
      },
    },
    explosionSize: ExplosionSize.Big
  },

  [EnemyClass.FighterBack]: {
    health: 4,
    speed: [2.4, 3.4],
    collisionDamage: 2,

    sprite: {
      kind: "animated",
      asset: fighterBackTexture,
      animation: "efb",
      scale: new Vector(3, 3),
      speed: 0.7
    },
    body: {
      asset: fighterBackTexture,
      sprite: "efb1",
      scale: new Vector(3, 3)
    },
    bullet: {
      maxStartEnergy: 4500,
      firingEnergy: 5000,
      rechargeRate: [0.85, 1],

      position: [new Vector(0, 12)],
      speed: 0.013,

      damage: 1,
      sprite: {
        kind: "animated",
        asset: bulletTexture,
        animation: "bullet",
        scale: new Vector(3, 3),
        speed: 0.35
      },
      body: {
        asset: bulletTexture,
        sprite: "bullet-1",
        scale: new Vector(3, 3)
      },
    },
    explosionSize: ExplosionSize.Big
  },

  [EnemyClass.Bomber]: {
    health: 5,
    speed: [1.4, 1.9],
    collisionDamage: 2,
    sprite: {
      kind: "animated",
      asset: enemyBomberTexture,
      animation: "ship",
      scale: new Vector(3, 3),
      speed: 0.4
    },
    body: {
      asset: enemyBomberTexture,
      sprite: "ship-1",
      scale: new Vector(3, 3)
    },
    bullet: {
      maxStartEnergy: 3000,
      firingEnergy: 6000,
      rechargeRate: [0.9, 1.1],
      position: [new Vector(0, 14)],
      speed: 0.006,
      damage: 2,
      sprite: {
        kind: "animated",
        asset: bulletTexture,
        animation: "bomb",
        scale: new Vector(3, 3),
        speed: 0.6
      },
      body: {
        asset: bulletTexture,
        sprite: "bomb-1",
        scale: new Vector(3, 3)
      }
    },
    explosionSize: ExplosionSize.Big
  }
};


type Events = "destroyed" | "escaped";

export class Enemy extends TeamedActor {
  public readonly events = new EventEmitter<Events>();

  private body: Body;
  private health: number;
  private energy: number;
  private readonly rechargeRate: number;
  private readonly speed: number;

  private sprite: Sprite;
  private readonly spec: EnemySpec;

  public constructor(engine: Engine, position: Vector, enemyClass: EnemyClass) {
    super("enemy", engine, Team.Enemy);
    this.spec = enemies[enemyClass];

    this.body = new Body(engine, this, {
      shape: new ShapeGenerator().generateFromSpritesheet(
        engine, this.spec.body.asset, this.spec.body.sprite,
        this.spec.body.scale),
      position: position
    });
    this.body.events.on("collision", this.onCollision, this);
    this.add(this.body);

    this.sprite = new Sprite(engine, this, {
      ...this.spec.sprite,
      position: this.body
    });
    this.add(this.sprite);

    let bulletSpec = this.spec.bullet;
    if (bulletSpec != null) {
      this.energy = engine.random.int(0, bulletSpec.maxStartEnergy);
      this.rechargeRate = engine.random.real(
        bulletSpec.rechargeRate[0], bulletSpec.rechargeRate[1]);
    }
    else {
      this.energy = 0;
      this.rechargeRate = 0;
    }

    this.health = this.spec.health;
    this.speed = engine.random.real(this.spec.speed[0], this.spec.speed[1]);
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

    let bulletSpec = this.spec.bullet;
    if (bulletSpec != null) {
      this.energy = this.energy + (delta * this.rechargeRate);
      if (this.energy >= bulletSpec.firingEnergy) {
        this.fire();
        this.energy -= bulletSpec.firingEnergy;
      }
    }
  }


  private fire() {
    if (this.spec.bullet == null) {
      return;
    }

    for (let point of this.spec.bullet.position) {
      let p = point.clone();
      p.x *= this.spec.body.scale.x;
      p.y *= this.spec.body.scale.y;
      let bulletPoint = this.body.position.clone().add(p);

      this.engine.add(new Bullet(this.engine, {
        team: this.team,
        direction:  new Vector(0, this.spec.bullet.speed),
        position: bulletPoint,
        sprite: this.spec.bullet.sprite,
        damage: this.spec.bullet.damage,
        shape: new ShapeGenerator().generateFromSpritesheet(
          this.engine, this.spec.bullet.body.asset,
          this.spec.bullet.body.sprite,
          this.spec.bullet.body.scale)
      }));
    }

    this.engine.loader.getSound(shootSound).play();
  }

  public damage(amount: number): boolean {
    if (this.health <= 0) {
      return false;
    }

    let consume = this.health >= amount;
    this.sprite.addEffect(Effect.FlashWhite);

    this.health -= amount;
    if (this.health <= 0) {
      this.events.emit("destroyed", this);
      this.engine.onNextUpdate(() => {
        this.kill();
        this.engine.add(new Explosion(this.engine, this.body.position,
          this.spec.explosionSize));
      });
    }
    else {
      this.engine.loader.getSound(hitSounds[
        this.engine.random.int(0, hitSounds.length-1)]).play();
    }

    return consume;
  }

  public receivesBulletDamage() {
    return true;
  }

  private onCollision(other: Actor) {
    if (other instanceof TeamedActor && other.team != this.team) {
      other.damage(this.spec.collisionDamage);
    }
  }
}
