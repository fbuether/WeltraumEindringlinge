import * as px from "pixi.js";
import * as planck from "planck-js";
import {Shape as planckShape} from "planck-js/lib/shape/index";

import {Engine} from "../engine/Engine";
import {AssetTag} from "../engine/Loader";


export class ShapeGenerator {
  public generateFromTexture(texture: px.Texture): planckShape {
    let box = new planck.Box(
      texture.width * Engine.PhysicsScale / 2,
      texture.height * Engine.PhysicsScale / 2);
    return box as unknown as planckShape;
  }

  public generateFromSpritesheet(engine: Engine, asset: AssetTag,
      name: string) {
    return this.generateFromTexture(
      engine.loader.getSpritesheet(asset).sheet.textures[name]);
  }
}
