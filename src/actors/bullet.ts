import * as ex from "excalibur";

import {getAssets} from "../assets";


export class Bullet extends ex.Actor {
  public onInitialize(engine: ex.Engine) {
    this.vel = new ex.Vector(0, -200);

    this.addDrawing("generic", getAssets().bullet);

    this.width = 3;
    this.height = 20;
    this.body.collider.type = ex.CollisionType.Active;


    this.once("collisionstart", (event: ex.CollisionStartEvent) => {
      console.log("bullet collidered!", event);
      this.kill();
      event.other.kill();
    });
  }


  public onPostUpdate(engine: ex.Engine, delta: number) {
    if (this.isOffScreen) {
      this.kill();
    }
  }
}
