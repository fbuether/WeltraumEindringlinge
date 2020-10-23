import * as EventEmitter from "eventemitter3";

import {Actor} from "../engine/Actor";
import {Sprite} from "../engine/components/Sprite";
import {Engine} from "../engine/Engine";
import {Loader} from "../engine/Loader";

import {Vector} from "../engine/Vector";

import {Enemy} from "../actors/Enemy";
import {Scene} from "../engine/Scene";


type Events = "enemy-destroyed" | "enemy-escaped" | "squad-destroyed";

export class Squadron extends Actor {
  public readonly events = new EventEmitter<Events>();

  public constructor(engine: Engine) {
    super("squadron", engine);

    let y = engine.render.screen.top + 100;

    let distance = 60;
    let count = 9;

    let start = engine.render.screen.left +
        (engine.render.screen.width / 2) +
        -(distance * count / 2) + (distance / 2);
    for (let i = 0; i < count; i++) {
      let x = start + distance * i;

      let enemy = new Enemy(engine, new Vector(x, y));
      enemy.events.on("destroyed", this.onEnemyDestroyed, this);
      enemy.events.on("escaped", this.onEnemyEscaped, this);
      this.add(enemy);
    }
  }


  private onEnemyDestroyed(enemy: Enemy) {
    this.components.delete(enemy);
    this.events.emit("enemy-destroyed", this, enemy);
  }

  private onEnemyEscaped(enemy: Enemy) {
    this.components.delete(enemy);
    this.events.emit("enemy-escaped", this, enemy);
  }
}


/*


export class Squadron extends ex.Actor {
  private enemyCount = 0;
  private onSquadronKilled: () => void;
  private onEnemyKilled: () => void;

  public constructor(onSquadronKilled: () => void,
                    onEnemyKilled: () => void) {
    super();
    this.onSquadronKilled = onSquadronKilled;
    this.onEnemyKilled = onEnemyKilled;
  }

  public onInitialize(engine: ex.Engine) {
    this.body.collider.type = ex.CollisionType.PreventCollision;


    // starting line.
    let y = -(engine.screen.viewport.height / 2) + 100;

    const distance = 60;
    let count = 9;

    let start = - (distance * count / 2) + (distance / 2);

    for (let i = 0; i < count; i++) {
      let x = start + distance * i;

      let enemy = new Enemy(this.onEnemyKilled);
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
      this.onSquadronKilled();
    // }
  }
}
*/
