import * as px from "pixi.js";
import {ColorOverlayFilter} from '@pixi/filter-color-overlay';
import * as EventEmitter from "eventemitter3";

import {Colour} from "../../engine/Colour";
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

  loops?: boolean;

  // runs only for non-looping animations.
  onComplete?: () => void;
}

export type SpriteConfig = (StaticSpriteConfig | AnimatedSpriteConfig) & {
  asset: AssetTag;
  position: Vector | Positioned;
  scale?: Vector;
  zIndex?: number;
  button?: boolean;
};


export enum Effect {
  FlashWhite,
  FlashRed
};



type Events = "mouse-over" | "mouse-out" | "click";

export class Sprite extends Renderable {
  private pxSprite: px.Sprite;
  private pxApp: px.Application;
  public readonly events = new EventEmitter<Events>();

  private engine: Engine;

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

    this.engine = engine;
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
      animation.loop = config.loops !== undefined ? config.loops : true;

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

    if (config.button) {
      this.pxSprite.interactive = true;
      this.pxSprite.buttonMode = true;
      this.pxSprite.on("mouseover", (event: px.InteractionEvent) => {
        this.events.emit("mouse-over", this);
      });

      this.pxSprite.on("mouseout", (event: px.InteractionEvent) => {
        this.events.emit("mouse-out", this);
      });

      this.pxSprite.on("mousedown", (event: px.InteractionEvent) => {
        this.events.emit("click", this);
      });
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
    this.events.removeAllListeners();
  }


  public render() {
    if (this.positionProvider != null) {
      this.pxSprite.x = this.positionProvider.position.x;
      this.pxSprite.y = this.positionProvider.position.y;
    }
  }


  public addEffect(effect: Effect) {
    if (effect == Effect.FlashWhite) {
      this.flash(Colour.white);
    }
    else if (effect == Effect.FlashRed) {
      this.flash(Colour.ofRGB(1, 0, 0));
    }
  }


  public setVisible(visible: boolean) {
    this.pxSprite.visible = visible;
  }

  private flash(colour: Colour) {
    this.pxSprite.filters = new Array<px.Filter>(
      new ColorOverlayFilter(colour.toPixi()));

    this.engine.delay(100, () => {
      this.pxSprite.filters = new Array<px.Filter>();
    });
  }

  public changeTexture(kind: "static" | "animated", asset: AssetTag,
                       name?: string) {
    if (kind == "static") {
      this.pxSprite.texture = name !== undefined
          ? this.engine.loader.getSpritesheet(asset)
            .sheet.textures[name]
          : this.engine.loader.getSprite(asset).resource.texture;
    }
    else if (this.pxSprite instanceof px.AnimatedSprite && name !== undefined) {
        this.pxSprite.textures = this.engine.loader.getSpritesheet(asset)
          .sheet.animations[name];
    }
  }
}
