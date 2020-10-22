
import {Actor} from "../engine/Actor";
import {Sprite} from "../engine/components/Sprite";
import {Engine} from "../engine/Engine";
import {Loader} from "../engine/Loader";
import {Body} from "../engine/components/Body";

import {Vector} from "../engine/Vector";
import {ShapeGenerator} from "../engine/ShapeGenerator";
import {Key} from "../engine/Keyboard";
import {Bullet} from "../actors/Bullet";

let spriteTex = Loader.add(require("../../assets/images/3rd/player.png"));


export class Player extends Actor {
  private static readonly speed: number = 240;
  private static readonly firingSpeed: number = 1000; // 1/s

  private health: number = 5;
  private lastShot: number = -1;

  private body: Body;


  public constructor(engine: Engine, position: Vector) {
    super("player", engine);

    let sprite = new Sprite(engine, this, spriteTex);
    this.add(sprite);

    this.body = new Body(engine, this,
      new ShapeGenerator().generateFromTexture(sprite.texture), position);
    this.add(this.body);

    sprite.attachTo(this.body);
  }


  public moveTo(position: Vector) {
    this.body.position = position;
  }


  public update(delta: number) {
    let movement = Player.speed * delta / 1000;

    let moveRight = this.engine.keyboard.isPressed(Key.D)
        || this.engine.keyboard.isPressed(Key.Right);
    let moveLeft = this.engine.keyboard.isPressed(Key.A)
        || this.engine.keyboard.isPressed(Key.Left);
    if (moveRight && !moveLeft) {
      this.body.moveBy(new Vector(movement, 0));
    }
    else if (moveLeft && !moveRight) {
      this.body.moveBy(new Vector(-movement, 0));
    }

    // firing.

    if (this.lastShot > 0) {
      this.lastShot -= delta;
    }

    let fires = this.engine.keyboard.isPressed(Key.Space);
    if (fires && this.lastShot <= 0) {
      this.engine.add(new Bullet(this.engine,
        this.body.position.add(new Vector(0, -25)),
        new Vector(0, -0.02)));
      this.lastShot = Player.firingSpeed;
    }
  }


  public getCharge() {
    return Math.min(1, Math.max(0, 1 - (this.lastShot / 1000)));
  }
}
