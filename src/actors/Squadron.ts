import * as planck from "planck-js";
import * as EventEmitter from "eventemitter3";

import {Random} from "../engine/Random";
import {Actor} from "../engine/Actor";
import {Sprite} from "../engine/components/Sprite";
import {Engine} from "../engine/Engine";
import {Loader} from "../engine/Loader";

import {Vector} from "../engine/Vector";

import {Enemy, EnemyClass} from "../actors/Enemy";
import {Scene} from "../engine/Scene";


export interface SquadronConfig {
  enemyClass: EnemyClass;
  count: number; // overall number of enemies
  spawnPackSize: [number,number]; // spawn these many at once
  spawnPackLimit: number; // maximum present enemies reached by pack spawning.
  spawnPackDelay: number; // spawn packs soonest after this many ms.
  spawnRandom: [number,number]; // delay after spawn event and actual spawn.
  spawnDelay: number; // spawn a single enemy at least every this many ms.
}


type Events = "enemy-destroyed" | "enemy-escaped" | "squad-destroyed";

export class Squadron extends Actor {
  public readonly events = new EventEmitter<Events>();
  private random: Random;

  private readonly config: SquadronConfig;

  private count: number;
  private current = 0;
  private lastSpawn = Number.POSITIVE_INFINITY;

  public constructor(engine: Engine, config: SquadronConfig) {
    super("squadron", engine);
    this.random = this.engine.random.fork();

    this.config = config;
    this.count = this.config.count;
  }

  public delete() {
    this.events.removeAllListeners();
  }


  public update(delta: number) {
    this.lastSpawn += delta;

    let packLimit = this.config.spawnPackLimit - this.current;

    // console.log(this.current, packLimit, this.lastSpawn, this.config.spawnPackDelay);

    if (this.current < packLimit
        && this.lastSpawn >= this.config.spawnPackDelay) {
      let spawnCount = Math.min(
        this.random.int(...this.config.spawnPackSize),
        this.count);
      for (let i = 0; i < spawnCount; i++) {
        this.spawnEnemy();
      }
      this.lastSpawn = 0;
    }

    if (this.lastSpawn >= this.config.spawnDelay) {
      this.spawnEnemy();
      this.lastSpawn = 0;
    }
  }

  private spawnEnemy() {
    if (this.count <= 0) {
      return;
    }

    this.current += 1;
    this.count -= 1;

    this.engine.delay(this.random.int(...this.config.spawnRandom), () => {
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

      let enemy = new Enemy(this.engine, pos, this.config.enemyClass);
      enemy.events.on("destroyed", this.onEnemyDestroyed, this);
      enemy.events.on("escaped", this.onEnemyEscaped, this);
      this.add(enemy);
    });
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
