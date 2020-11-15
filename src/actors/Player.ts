import * as EventEmitter from "eventemitter3";

import {Team, TeamedActor} from "../actors/TeamedActor";
import {Actor} from "../engine/Actor";
import {Sprite, Effect} from "../engine/components/Sprite";
import {Engine} from "../engine/Engine";
import {Loader} from "../engine/Loader";
import {Body} from "../engine/components/Body";
import {Explosion, ExplosionSize} from "../actors/Explosion";

import {Vector} from "../engine/Vector";
import {ShapeGenerator} from "../engine/ShapeGenerator";
import {Key} from "../engine/Keyboard";
import {Bullet} from "../actors/Bullet";


const playerShipTexture = Loader.addSpritesheet(
  require("../../assets/images/player-medium.png"), {
    frames: {
      "small-1": {frame: {x:  3, y: 4, w: 12, h: 20} },
      "small-2": {frame: {x: 21, y: 4, w: 12, h: 20} },
      "medium-1": {frame: {x: 39, y: 0,  w: 12, h: 29} },
      "medium-2": {frame: {x:  3, y: 29, w: 12, h: 29} },
      "mplayeedium+-1": {frame: {x: 18, y: 29, w: 18, h: 29} },
      "medium+-2": {frame: {x: 36, y: 29, w: 18, h: 29} }
    },
    animations: {
      "small": ["small-1", "small-2"],
      "medium": ["medium-1", "medium-2"],
      "medium+": ["medium+-1", "medium+-2"]
    }
  });

const shootSound = Loader.addSound(
  require("../../assets/sounds/player-shoot.wav.opus"));

const hitSounds = [
  Loader.addSound(require("../../assets/sounds/hit-player-1.wav.opus")),
  Loader.addSound(require("../../assets/sounds/hit-player-2.wav.opus"))
];


let weaponPoints: { [key: string]: Array<Vector> } = {
  "small": [new Vector(-5, -10), new Vector(5, -10)]
};

let bulletTexture = Loader.addSpritesheet(
  require("../../assets/images/bullet.png"), {
    frames: {
      "bullet-1": {frame: {x: 0, y: 0, w: 2, h: 7} },
      "bullet-2": {frame: {x: 2, y: 0, w: 2, h: 7} },
      "bullet-3": {frame: {x: 4, y: 0, w: 2, h: 7} }
    },
    animations: {
      "bullet": ["bullet-1", "bullet-2", "bullet-3"]
    }
  });


interface PlayerShip {
  animation: string;
  shape: string;
  health: number;
}

export type PlayerShipType = "small" | "medium" | "medium+";


let playerShips: Record<PlayerShipType, PlayerShip> = {
  "small": {
    animation: "small",
    shape: "small-1",
    health: 4
  },
  "medium": {
    animation: "medium",
    shape: "medium-1",
    health: 6
  },
  "medium+": {
    animation: "medium+",
    shape: "medium+-1",
    health: 8
  }
};


type Events = "destroyed" | "health-changed";

export class Player extends TeamedActor {
  private static readonly Speed = 24;
  private static readonly FiringSpeed = 300;
  private static readonly CollisionDamage = 5;

  public readonly events = new EventEmitter<Events>();

  private readonly ship: PlayerShip;
  private _health: number;
  private lastShot: number = -1;

  private body: Body;
  private sprite: Sprite;

  public get health(): number {
    return this._health;
  }

  public get position(): Vector {
    return this.body.position;
  }


  public constructor(engine: Engine, position: Vector, ship: PlayerShipType) {
    super("player", engine, Team.Player);

    this.ship = playerShips[ship];
    this._health = this.ship.health;

    this.body = new Body(engine, this, {
      shape: new ShapeGenerator().generateFromSpritesheet(
        engine, playerShipTexture, ship + "-1", new Vector(3, 3)),
      position: position
    });
    this.body.events.on("collision", this.onCollision, this);
    this.add(this.body);

    this.sprite = new Sprite(engine, this, {
      kind: "animated",
      asset: playerShipTexture,
      animation: ship,
      speed: 0.5,
      position: this.body,
      scale: new Vector(3, 3)
    })
    this.add(this.sprite);
  }

  public delete() {
    this.events.removeAllListeners();
  }


  public moveTo(position: Vector) {
    this.body.position = position;
  }


  private fireWeapon() {
    for (let point of weaponPoints["small"]) {
      let point2 = point.clone().mul(3); // for scaling.

      this.engine.add(new Bullet(this.engine, {
        team: Team.Player,
        damage: 1,
        direction: new Vector(0, -0.02),
        position: this.body.position.add(
          // for now, the position computation is moot, as we do not have pixel-
          // perfect collision detection.
          point2),
        sprite: {
          kind: "animated",
          asset: bulletTexture,
          animation: "bullet",
          scale: new Vector(3, 3),
          speed: 0.333
        },
        shape: new ShapeGenerator().generateFromSpritesheet(
          this.engine, bulletTexture, "bullet-1", new Vector(3, 3))
      }));

      this.engine.sound.play(shootSound);
     }

    this.lastShot = Player.FiringSpeed;
  }


  // enabled after beaming the player into the game.
  private receivesInput: boolean = false;

  public update(delta: number) {
    this.handleInput(delta);

    if (this.lastShot > 0) {
      this.lastShot -= delta;
    }
  }

  private handleInput(delta: number) {
    // input.
    if (!this.receivesInput) {
      return;
    }
    let movement = Player.Speed * delta / 1000;
    let moveRight = this.engine.keyboard.isPressed(Key.D)
        || this.engine.keyboard.isPressed(Key.Right);
    let moveLeft = this.engine.keyboard.isPressed(Key.A)
        || this.engine.keyboard.isPressed(Key.Left);

    let xPos = this.body.position.x;
    let size = this.engine.getScreenBounds();
    let dist = 80;
    let canMoveLeft = xPos - dist > size.left;
    let canMoveRight = xPos + dist < size.right;


    if (moveRight && !moveLeft && canMoveRight) {
      this.body.applyForce(new Vector(movement, 0));
    }

    if (moveLeft && !moveRight && canMoveLeft) {
      this.body.applyForce(new Vector(-movement, 0));
    }

    // firing.
    let fires = this.engine.keyboard.isPressed(Key.Space);
    if (fires && this.lastShot <= 0) {
      this.fireWeapon();
    }
  }

  private onCollision(other: Actor) {
    if (other instanceof TeamedActor && other.team != this.team) {
      other.damage(Player.CollisionDamage);
    }
  }

  public damage(amount: number): boolean {
    let consumed = this._health > 0;

    this.sprite.addEffect(Effect.FlashRed);

    this._health -= amount;
    if (this._health <= 0) {
      this._health = 0;
    }

    this.events.emit("health-changed", this);

    if (this._health <= 0) {
      this.events.emit("destroyed", this);
      this.kill();
      this.engine.add(new Explosion(this.engine, this.body.position,
        ExplosionSize.Big));
    }
    else {
      this.engine.sound.play(hitSounds[
        this.engine.random.int(0, hitSounds.length-1)]);
    }

    return consumed;
  }

  public receivesBulletDamage() {
    return true;
  }


  public setReceivesInput(receivesInput: boolean) {
    this.receivesInput = receivesInput;
  }

  // public getCharge() {
  //   return Math.min(1, Math.max(0, 1 - (this.lastShot / 1000)));
  // }
}
