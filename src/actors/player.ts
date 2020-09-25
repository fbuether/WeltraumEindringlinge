import * as ex from "excalibur";

import {Bullet} from "../actors/bullet";
import {getAssets} from "../assets";


export class Player extends ex.Actor {
  private static readonly speed: number = 200;
  private static readonly firingSpeed: number = 1000; // 1/s

  private health: number = 5;
  private lastShot: number = -1;

  public constructor() {
    super();

    this.body.collider.type = ex.CollisionType.Passive;
  }


  public onInitialize(engine: ex.Engine) {
    this.addDrawing("generic", getAssets().player);
  }


  public onPostUpdate(engine: ex.Engine, delta: number) {
    // movement
    let moveLeft = engine.input.keyboard.isHeld(ex.Input.Keys.A)
        || engine.input.keyboard.isHeld(ex.Input.Keys.Left);
    let moveRight = engine.input.keyboard.isHeld(ex.Input.Keys.D)
        || engine.input.keyboard.isHeld(ex.Input.Keys.Right);


    let movement = Player.speed * delta / 1000;

    // console.log(delta, movement);

    if (moveLeft && !moveRight) {
      this.pos = this.pos.add(new ex.Vector(-movement, 0));
    }
    else if (moveRight && !moveLeft) {
      this.pos = this.pos.add(new ex.Vector(movement, 0));
    }

    // check if firing.
    let fires = engine.input.keyboard.isHeld(ex.Input.Keys.Space);

    this.lastShot -= delta;

    if (fires && this.lastShot <= 0) {
      let bullet = new Bullet();
      bullet.pos = this.pos.add(new ex.Vector(0, -24));
      this.scene.add(bullet);

      this.lastShot = Player.firingSpeed;
    }
  }

  public getCharge() {
    return Math.min(1, Math.max(0, 1 - (this.lastShot / 1000)));
  }
}
