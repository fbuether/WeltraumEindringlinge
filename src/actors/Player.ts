import * as EventEmitter from "eventemitter3";

import {Team, TeamedActor} from "../actors/TeamedActor";
import {Actor} from "../engine/Actor";
import {Sprite, Effect} from "../engine/components/Sprite";
import {Engine} from "../engine/Engine";
import {Loader} from "../engine/Loader";
import {Body} from "../engine/components/Body";
import {Explosion} from "../actors/Explosion";

import {Vector} from "../engine/Vector";
import {ShapeGenerator} from "../engine/ShapeGenerator";
import {Key} from "../engine/Keyboard";
import {Bullet} from "../actors/Bullet";


const psX = 102;
const psY = 93;
const playerSheet = Loader.addSpritesheet(
  require("../../assets/images/player.png"), {
    frames: {
      "ship-small":      { frame: { x: psX * 1, y: psY * 0, w: psX, h: psY} },
      "small-exhaust-1": { frame: { x: psX * 2, y: psY * 0, w: psX, h: psY} },
      "small-exhaust-2": { frame: { x: psX * 0, y: psY * 1, w: psX, h: psY} },
      "small-weapon-1":  { frame: { x: psX * 1, y: psY * 1, w: psX, h: psY} },
      "ship-big":        { frame: { x: psX * 2, y: psY * 1, w: psX, h: psY} },
      "big-exhaust-1-1": { frame: { x: psX * 0, y: psY * 2, w: psX, h: psY} },
      "big-exhaust-1-2": { frame: { x: psX * 1, y: psY * 2, w: psX, h: psY} },
      "big-exhaust-2-1": { frame: { x: psX * 2, y: psY * 2, w: psX, h: psY} },
      "big-exhaust-2-2": { frame: { x: psX * 0, y: psY * 3, w: psX, h: psY} },
      "big-weapon-1":    { frame: { x: psX * 1, y: psY * 3, w: psX, h: psY} },
      "big-weapon-2":    { frame: { x: psX * 2, y: psY * 3, w: psX, h: psY} }
    },
    animations: {
      "small-exhaust": ["small-exhaust-1", "small-exhaust-2"],
      "big-exhaust-1": ["big-exhaust-1-1", "big-exhaust-1-2"],
      "big-exhaust-2": ["big-exhaust-2-1", "big-exhaust-2-2"],
    }
  });

const weaponPoints = {
  "ship-small": {
    "weapon-0": [
      new Vector(-psX/2, -psY/2).add(new Vector(37, 17)),
      new Vector(-psX/2, -psY/2).add(new Vector(64, 17))
    ]
  }
};


let bulletTexture = Loader.addSpritesheet(
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

type Events = "destroyed" | "health-changed";


export class Player extends TeamedActor {
  private static readonly speed: number = 24;
  private static readonly firingSpeed: number = 300;

  public readonly events = new EventEmitter<Events>();

  private _health: number = 6;
  private lastShot: number = -1;

  private body: Body;
  private sprite: Sprite;

  public get health(): number {
    return this._health;
  }

  public constructor(engine: Engine, position: Vector) {
    super("player", engine, Team.Player);

    this.body = new Body(engine, this, {
      shape: new ShapeGenerator().generateFromSpritesheet(
        engine, playerSheet, "ship-small"),
      position: position
    });
    this.add(this.body);

    this.sprite = new Sprite(engine, this, {
      kind: "static",
      asset: playerSheet,
      position: this.body,
      name: "ship-small"
    })
    this.add(this.sprite);
  }


  public moveTo(position: Vector) {
    this.body.position = position;
  }


  private fireWeapon() {
    for (let point of weaponPoints["ship-small"]["weapon-0"]) {
      let point2 = new Vector(point.x, -(this.body.size.y / 2 + 11));

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
          speed: 0.333,
          loops: true
        },
        shape: new ShapeGenerator().generateFromSpritesheet(
          this.engine, bulletTexture, "bullet-1")
      }));
    }
  }


  public update(delta: number) {

    // input.
    let movement = Player.speed * delta / 1000;
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
    if (this.lastShot > 0) {
      this.lastShot -= delta;
    }

    let fires = this.engine.keyboard.isPressed(Key.Space);
    if (fires && this.lastShot <= 0) {
      this.fireWeapon();
      this.lastShot = Player.firingSpeed;
    }
  }


  public damage(amount: number): boolean {
    let consumed = this._health > 0;

    this.sprite.addEffect(Effect.FlashRed);

    this._health -= amount;
    this.events.emit("health-changed", this);

    if (this._health <= 0) {
      this.events.emit("destroyed", this);
      this.kill();
      this.engine.add(new Explosion(this.engine, this.body.position));
    }

    return consumed;
  }

  public getCharge() {
    return Math.min(1, Math.max(0, 1 - (this.lastShot / 1000)));
  }
}
