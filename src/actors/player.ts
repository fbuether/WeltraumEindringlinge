import * as ex from "excalibur";

import {Bullet} from "../actors/bullet";


export class Player extends ex.Actor {
  private static readonly speed: number = 200;

  public health: number;

  public constructor() {
    super();
    this.health = 5;

    // this.pos = new ex.Vector(0, 100);
    this.width = 50;
    this.height = 50;
    this.color = ex.Color.fromHSL(122, 0.2, 0.7);

    this.body.collider.type = ex.CollisionType.Active;
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
    let fires = engine.input.keyboard.wasPressed(ex.Input.Keys.Space);

    if (fires) {
      let bullet = new Bullet();
      bullet.pos = this.pos.add(new ex.Vector(0, -50));
      engine.add(bullet);
    }
  }
}
