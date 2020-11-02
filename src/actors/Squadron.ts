import * as planck from "planck-js";
import * as EventEmitter from "eventemitter3";

import {Random} from "../engine/Random";
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
  private random: Random;

  private count: number;
  private current = 0;
  private lastSpawn = Number.POSITIVE_INFINITY;

  public constructor(engine: Engine, count: number) {
    super("squadron", engine);
    this.random = this.engine.random.fork();

    this.count = count;
  }

  public delete() {
    this.events.removeAllListeners();
  }


  public update(delta: number) {
    this.lastSpawn += delta;

    // on less than 4 spawn up to 3 new, so max 6.
    if (this.current < 4 && this.lastSpawn >= 3000) {
      this.engine.delay(this.random.int(200, 1200), () => {
        this.spawnEnemy();
        this.spawnEnemy();
        this.spawnEnemy();
      });
      this.lastSpawn = 0;
    }

    // if last spawn is more than 10 seconds ago, spawn one more.
    if (this.lastSpawn >= 10000) {
      this.engine.delay(this.random.int(200, 1200), () => {
        this.spawnEnemy();
      });
      this.lastSpawn = 0;
    }
  }

  private spawnEnemy() {
    if (this.count <= 0) {
      return;
    }

    let screen = this.engine.getScreenBounds();

    let hasOverlap = false;
    let pos = new Vector(0, 0);

    for (let i = 0; i < 10; i++) {
      let y = screen.top + 60;
      let x = this.random.int(screen.left + 60, screen.right - 60);
      pos = new Vector(x, y);

      let newEnemyShape = new planck.AABB(
        new Vector(-36, -24).add(pos).mul(Engine.PhysicsScale),
        new Vector(36, 24).add(pos).mul(Engine.PhysicsScale));

      hasOverlap = false;
      this.engine.physics.queryAABB(newEnemyShape, () => {
        hasOverlap = true;
        return false;
      });

      if (!hasOverlap) {
        break;
      }
    }

    if (hasOverlap) {
      console.warn("could not place enemy, too much overlap.");
      return;
    }

    let enemy = new Enemy(this.engine, pos);
    enemy.events.on("destroyed", this.onEnemyDestroyed, this);
    enemy.events.on("escaped", this.onEnemyEscaped, this);
    this.add(enemy);

    this.current += 1;
    this.count -= 1;
  }


  private onEnemyDestroyed(enemy: Enemy) {
    this.current -= 1;

    this.components.delete(enemy);
    this.events.emit("enemy-destroyed", this, enemy);

    if (this.count <= 0 && this.current <= 0) {
      this.events.emit("squad-destroyed", this);
      this.kill();
    }
  }

  private onEnemyEscaped(enemy: Enemy) {
    this.components.delete(enemy);
    enemy.kill();
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
