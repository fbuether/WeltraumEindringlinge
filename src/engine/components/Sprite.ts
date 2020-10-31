import * as px from "pixi.js";

import {Vector} from "../../engine/Vector";
import {AssetTag} from "../../engine/Loader";
import {Engine} from "../../engine/Engine";
import {Positioned} from "../../engine/components/Positioned";
import {Renderable} from "../../engine/components/Renderable";
import {Component} from "../../engine/components/Component";
import {Updatable} from "../../engine/components/Updatable";


interface StaticSpriteConfig {
  kind: "static";

  // name of the frame.
  // if undefined, image contains just one sprite.
  name?: string;
}

interface AnimatedSpriteConfig {
  kind: "animated";

  // name of the animation.
  animation: string;

  // duration per frame in milliseconds.
  speed: number;

  loops: boolean;

  // runs only for non-looping animations.
  onComplete?: () => void;
}

export type SpriteConfig = (StaticSpriteConfig | AnimatedSpriteConfig) & {
  asset: AssetTag;
  position: Vector | Positioned;
  scale?: Vector;
  zIndex?: number;
};


export class Sprite extends Renderable {
  private pxSprite: px.Sprite;
  private pxApp: px.Application;

  public get texture(): px.Texture {
    return this.pxSprite.texture;
  }

  public get position(): Vector {
    return new Vector(this.pxSprite.x, this.pxSprite.y);
  }

  public get size(): Vector {
    return new Vector(this.pxSprite.width, this.pxSprite.height);
  }


  public constructor(engine: Engine, parent: Component, config: SpriteConfig) {
    super("sprite", parent);
    this.pxApp = engine.render;

    if (config.kind == "static") {
      let texture = config.name !== undefined
          ? engine.loader.getSpritesheet(config.asset)
            .sheet.textures[config.name]
          : engine.loader.getSprite(config.asset).resource.texture;
      this.pxSprite = px.Sprite.from(texture);
    }
    else {
      let animation = new px.AnimatedSprite(
        engine.loader.getSpritesheet(config.asset)
          .sheet.animations[config.animation]);

      animation.animationSpeed = 1 / (1000 * config.speed);
      animation.loop = config.loops;

      if (config.onComplete) {
        animation.onComplete = config.onComplete;
      }

      this.pxSprite = animation;
    }

    if (config.position instanceof Vector) {
      this.pxSprite.x = config.position.x;
      this.pxSprite.y = config.position.y;
    }
    else if (Positioned.isPositioned(config.position)) {
      this.positionProvider = config.position;
      this.render();
    }

    if (config.scale) {
      this.pxSprite.scale.x = config.scale.x;
      this.pxSprite.scale.y = config.scale.y;
    }
    if (config.zIndex) {
      this.pxSprite.zIndex = config.zIndex;
    }

    this.pxSprite.anchor.set(0.5, 0.5);
    this.pxApp.stage.addChild(this.pxSprite);
  }


  private positionProvider: Positioned | null = null;

  public update(delta: number) {
    if (this.pxSprite instanceof px.AnimatedSprite) {
      this.pxSprite.update(delta);
    }
  }


  public move(position: Vector) {
    this.pxSprite.x = position.x;
    this.pxSprite.y = position.y;
  }


  public delete() {
    this.pxApp.stage.removeChild(this.pxSprite);
  }


  public render() {
    if (this.positionProvider != null) {
      this.pxSprite.x = this.positionProvider.position.x;
      this.pxSprite.y = this.positionProvider.position.y;
    }
  }
}
