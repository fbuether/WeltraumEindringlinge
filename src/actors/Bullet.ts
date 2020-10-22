
import {Actor} from "../engine/Actor";
import {Body} from "../engine/components/Body";
import {Engine} from "../engine/Engine";
import {Loader} from "../engine/Loader";
import {Sprite} from "../engine/components/Sprite";

import {Vector} from "../engine/Vector";
import {ShapeGenerator} from "../engine/ShapeGenerator";


let spriteTex = Loader.add(require("../../assets/images/3rd/bullet.png"));


export class Bullet extends Actor {
  private body: Body;

  public constructor(engine: Engine, position: Vector, direction: Vector) {
    super("bullet", engine);
    // this.engine = engine;

    let sprite = new Sprite(engine, this, spriteTex);
    this.add(sprite);

    this.body = new Body(engine, this,
      new ShapeGenerator().generateFromTexture(sprite.texture), position, true);
    this.body.applyForce(direction);

    this.body.onCollision(this.onCollision.bind(this));
    this.add(this.body);

    sprite.attachTo(this.body);
  }

  private onCollision(other: Actor) {
    other.kill();
    this.kill();
  }

  public update(delta: number) {
    if (!this.body.isOnScreen()) {
      this.kill();
    }
  }
}
