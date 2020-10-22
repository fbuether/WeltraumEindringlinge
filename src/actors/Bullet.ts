
import {Actor} from "../engine/Actor";
import {Body} from "../engine/components/Body";
import {Engine} from "../engine/Engine";
import {Loader} from "../engine/Loader";
import {Sprite} from "../engine/components/Sprite";

import {Vector} from "../engine/Vector";
import {ShapeGenerator} from "../engine/ShapeGenerator";


let texture = Loader.addSpritesheet(
  require("../../assets/images/3rd/SpaceInvaders-3.png"), {
    frames: {
      "bullet": { frame: {x: 117, y: 15, w: 3, h: 18 } }
    }
  });


export class Bullet extends Actor {
  private body: Body;

  public constructor(engine: Engine, position: Vector, direction: Vector) {
    super("bullet", engine);

    let sprite = new Sprite(engine, this, texture, "bullet");
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
