
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
      new ShapeGenerator().generateFromTexture(sprite.texture), position);
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

// export class Bullet extends ex.Actor {
  // public onInitialize(engine: ex.Engine) {
  //   this.vel = new ex.Vector(0, -200);

  //   this.addDrawing("generic", getAssets().bullet);

  //   this.width = 3;
  //   this.height = 20;
  //   this.body.collider.type = ex.CollisionType.Active;


  //   this.once("collisionstart", (event: ex.CollisionStartEvent) => {
  //     this.kill();
  //     event.other.kill();
  //   });
  // }


  // public onPostUpdate(engine: ex.Engine, delta: number) {
  //   if (this.isOffScreen) {
  //     this.kill();
  //   }
  // }
// }
