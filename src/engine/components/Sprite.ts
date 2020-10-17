import * as px from "pixi.js";

import {AssetTag} from "../../engine/Loader";
import {Engine} from "../../engine/Engine";
import {Positioned} from "../../engine/components/Positioned";
import {Renderable} from "../../engine/components/Renderable";


export class Sprite extends Renderable
{
  private image: px.Texture;
  private pxSprite: px.Sprite;

  public get texture(): px.Texture {
    return this.pxSprite.texture;
  }

  public constructor(engine: Engine, asset: AssetTag) {
    super();
    this.image = engine.getResource(asset).texture;

    this.pxSprite = px.Sprite.from(this.image);
    this.pxSprite.anchor.set(0.5, 0.5);

    engine.render.stage.addChild(this.pxSprite);
  }


  private positionProvider: Positioned | null = null;

  public attachTo(positioned: Positioned) {
    this.positionProvider = positioned;
    this.render();
  }


  public render() {
    if (this.positionProvider != null) {
      this.pxSprite.x = this.positionProvider.position.x;
      this.pxSprite.y = this.positionProvider.position.y;
    }
  }
}
