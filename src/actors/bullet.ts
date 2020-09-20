import * as ex from "excalibur";

import {getAssets} from "../assets";


export class Bullet extends ex.Actor {
  private static readonly speed: number = 2000;


  public onInitialize(engine: ex.Engine) {
    this.vel = new ex.Vector(0, -200);

    this.addDrawing("generic", getAssets().bullet);

    // this.width = 3;
    // this.height = 20;
    // this.color = ex.Color.fromHSL(0, 1, 0.8);
  }

  public onPostUpdate(engine: ex.Engine, delta: number) {
    if (this.isOffScreen) {
      this.kill();
    }
  }
}
