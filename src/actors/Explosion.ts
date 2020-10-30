import * as px from "pixi.js";

import {Engine} from "../engine/Engine";
import {Vector} from "../engine/Vector";
import {Actor} from "../engine/Actor";
import {Loader} from "../engine/Loader";

import {Sprite} from "../engine/components/Sprite";


let pxW = 72;
let pxH = 72;

let texture = Loader.addSpritesheet(
  require("../../assets/images/explosion.png"), {
    frames: {
      "1": { frame: { x: pxW * 0, y: pxH * 0, w: pxW, h: pxH } },
      "2": { frame: { x: pxW * 1, y: pxH * 0, w: pxW, h: pxH } },
      "3": { frame: { x: pxW * 2, y: pxH * 0, w: pxW, h: pxH } },
      "4": { frame: { x: pxW * 0, y: pxH * 1, w: pxW, h: pxH } },
      "5": { frame: { x: pxW * 1, y: pxH * 1, w: pxW, h: pxH } }
    },
    animations: {
      "explosion": ["1", "2", "3", "4", "5"]
    }
  });


export class Explosion extends Actor {

  public constructor(engine: Engine, position: Vector) {
    super("explosion", engine);

    this.add(new Sprite(engine, this, {
      kind: "animated",
      position: position,
      asset: texture,
      animation: "explosion",
      speed: 0.25,
      loops: false,
      onComplete: () => {
        this.kill();
      }
    }));
  }
}
