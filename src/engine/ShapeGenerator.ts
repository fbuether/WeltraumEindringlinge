import * as px from "pixi.js";
import * as planck from "planck-js";
import {Shape as planckShape} from "planck-js/lib/shape/index";

import {Engine} from "../engine/Engine";


export class ShapeGenerator {
  public generateFromTexture(texture: px.Texture): planckShape {
    let box = new planck.Box(
      texture.width * Engine.PhysicsScale / 2,
      texture.height * Engine.PhysicsScale / 2);
    return box as unknown as planckShape;
  }
}
