import * as ex from "excalibur";

import {getAssets} from "../assets";


export class Explosion extends ex.Actor {
  public onInitialize(engine: ex.Engine) {
    this.body.collider.type = ex.CollisionType.PreventCollision;

    let expl = new ex.Animation({
      engine: engine,
      loop: false, speed: 200,
      sprites: getAssets().explosion
    });
    this.addDrawing("generic", expl);

    this.width = 30;
    this.height = 30;

    engine.add(new ex.Timer({
      interval: 800,
      repeats: false,
      fcn: () => {
        this.kill();
      }
    }));
  }
}
