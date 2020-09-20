import * as ex from "excalibur";

import {getAssets} from "../assets";


export class Explosion extends ex.Actor {
  public onInitialize(engine: ex.Engine) {
    this.addDrawing("generic", getAssets().explosion);
    this.width = 30;
    this.height = 30;
    this.body.collider.type = ex.CollisionType.Active;

    engine.add(new ex.Timer({
      interval: 800,
      repeats: false,
      fcn: () => {
        this.kill();
      }
    }));
  }
}
