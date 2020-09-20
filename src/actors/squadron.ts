import * as ex from "excalibur";

import {Enemy} from "../actors/enemy";


export class Squadron extends ex.Actor {

  public onInitialize(engine: ex.Engine) {
    this.body.collider.type = ex.CollisionType.PreventCollision;


    // starting line.
    let y = -(engine.screen.viewport.height / 2) + 100;

    const distance = 60;
    let count = 9;

    let start = - (distance * count / 2) + (distance / 2);

    for (let i = 0; i < count; i++) {
      let x = start + distance * i;

      let enemy = new Enemy();
      enemy.pos = new ex.Vector(x, y);
      this.scene.add(enemy);
    }
  }
}
