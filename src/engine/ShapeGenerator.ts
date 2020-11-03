import * as px from "pixi.js";
import * as planck from "planck-js";
import {Shape as planckShape} from "planck-js/lib/shape/index";

import {Engine} from "../engine/Engine";
import {AssetTag} from "../engine/Loader";
import {Vector} from "../engine/Vector";


export class ShapeGenerator {
  public generateFromTexture(texture: px.Texture, scale: Vector): planckShape {
    let box = new planck.Box(
      texture.width * Engine.PhysicsScale / 2 * scale.x,
      texture.height * Engine.PhysicsScale / 2 * scale.y);
    return box as unknown as planckShape;
  }

  public generateFromSpritesheet(engine: Engine, asset: AssetTag,
      name: string, scale: Vector) {
    return this.generateFromTexture(
      engine.loader.getSpritesheet(asset).sheet.textures[name], scale);
  }
}
