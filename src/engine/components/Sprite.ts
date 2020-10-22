import * as px from "pixi.js";

import {AssetTag} from "../../engine/Loader";
import {Engine} from "../../engine/Engine";
import {Positioned} from "../../engine/components/Positioned";
import {Renderable} from "../../engine/components/Renderable";
import {Deletable} from "../../engine/components/Deletable";
import {Component} from "../../engine/components/Component";


export class Sprite extends Renderable implements Deletable {
  private image: px.Texture;
  private pxSprite: px.Sprite;
  private pxApp: px.Application;

  public get texture(): px.Texture {
    return this.pxSprite.texture;
  }

  public constructor(engine: Engine, parent: Component, asset: AssetTag) {
    super("sprite", parent);
    this.pxApp = engine.render;

    this.image = engine.getResource(asset).texture;

    this.pxSprite = px.Sprite.from(this.image);
    this.pxSprite.anchor.set(0.5, 0.5);

    this.pxApp.stage.addChild(this.pxSprite);
  }


  private positionProvider: Positioned | null = null;

  public attachTo(positioned: Positioned) {
    this.positionProvider = positioned;
    this.render();
  }


  public onDelete() {
    this.pxApp.stage.removeChild(this.pxSprite);
  }


  public render() {
    if (this.positionProvider != null) {
      this.pxSprite.x = this.positionProvider.position.x;
      this.pxSprite.y = this.positionProvider.position.y;
    }
  }
}