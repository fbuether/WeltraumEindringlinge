import * as ex from "excalibur";

import {Enemy} from "../actors/enemy";


export class Squadron extends ex.Actor {

  private enemyCount = 0;

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
      enemy.on("prekill", () => {
        this.enemyCount -= 1;
        this.checkWin();
      });
      this.enemyCount += 1;
      this.scene.add(enemy);
    }
  }

  private checkWin() {
    // if (this.enemyCount <= 0) {
      this.scene.emit("squadron-killed", new ex.GameEvent<ex.Scene>());
    // }
  }
}
