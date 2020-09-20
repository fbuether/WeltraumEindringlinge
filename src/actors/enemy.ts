import * as ex from "excalibur";

import {Bullet} from "../actors/bullet";
import {getAssets} from "../assets";


export class Enemy extends ex.Actor {
  private static readonly speed: number = 20;
  private static readonly firingSpeed: number = 1000; // 1/s

  public constructor() {
    super();

    this.body.collider.type = ex.CollisionType.Active;
  }


  public onInitialize(engine: ex.Engine) {
    this.addDrawing("generic", getAssets().enemy1);
  }


  public onPostUpdate(engine: ex.Engine, delta: number) {

    let movement = Enemy.speed * delta / 1000;
    this.pos = this.pos.add(new ex.Vector(0, movement));
  }
}
