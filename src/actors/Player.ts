
import {Actor} from "../engine/Actor";
import {Sprite} from "../engine/components/Sprite";
import {Engine} from "../engine/Engine";
import {Loader} from "../engine/Loader";
import {Body} from "../engine/components/Body";

import {Vector} from "../engine/Vector";
import {ShapeGenerator} from "../engine/ShapeGenerator";

import {Bullet} from "../actors/Bullet";

let spriteTex = Loader.add(require("../../assets/images/3rd/player.png"));


export class Player extends Actor {
  private static readonly speed: number = 240;
  private static readonly firingSpeed: number = 1000; // 1/s

  private health: number = 5;
  private lastShot: number = -1;

  private body: Body;


  public constructor(engine: Engine, position: Vector) {
    super(engine);

    let sprite = new Sprite(engine, spriteTex);
    this.add(sprite);

    this.body = new Body(engine,
      new ShapeGenerator().generateFromTexture(sprite.texture), position);
    this.add(this.body);

    sprite.attachTo(this.body);
  }


  public moveTo(position: Vector) {
    this.body.position = position;
  }


  public update(delta: number) {
    let movement = Player.speed * delta / 1000;

    let moveRight = this.engine.keyboard.isPressed("d");
    let moveLeft = this.engine.keyboard.isPressed("a");
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

    let fires = this.engine.keyboard.isPressed(" ");
    if (fires && this.lastShot <= 0) {
      this.engine.add(new Bullet(this.engine,
        this.body.position.add(new Vector(0, -20)),
        new Vector(0, -0.01)));
      this.lastShot = Player.firingSpeed;
    }
  }


  public getCharge() {
    return Math.min(1, Math.max(0, 1 - (this.lastShot / 1000)));
  }
}
