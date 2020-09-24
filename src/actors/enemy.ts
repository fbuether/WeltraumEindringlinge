import * as ex from "excalibur";

import {Bullet} from "../actors/bullet";
import {getAssets} from "../assets";
import {Explosion} from "../actors/explosion";
import {IncreaseScoreEvent} from "../actors/increase-score-event";


export class Enemy extends ex.Actor {
  private static readonly speed: number = 20;
  private static readonly firingSpeed: number = 1000; // 1/s


  public onInitialize(engine: ex.Engine) {
    let anim = new ex.Animation({
      engine: engine,
      loop: true, speed: 900,
      sprites: getAssets().enemy1
    });

    this.addDrawing("generic", anim);
    this.width = 30;
    this.height = 30;
    this.body.collider.type = ex.CollisionType.Active;
  }


  public onPreKill() {
    let explosion = new Explosion();
    explosion.pos = this.pos;
    this.scene.emit("increaseScore", new IncreaseScoreEvent());
    this.scene.add(explosion);
  }


  public onPostUpdate(engine: ex.Engine, delta: number) {
    let movement = Enemy.speed * delta / 1000;
    this.pos = this.pos.add(new ex.Vector(0, movement));

    // if below the screen
    if (this.isOffScreen && this.pos.y > 0) {
      this.kill();
    }
  }
}
