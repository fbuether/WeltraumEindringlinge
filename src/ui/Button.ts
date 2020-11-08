import * as px from "pixi.js";

import {Vector} from "../engine/Vector";
import {Loader} from "../engine/Loader";
import {Sprite, Effect} from "../engine/components/Sprite";
import {Gui} from "../engine/Gui";
import {Engine} from "../engine/Engine";


let buttonTexture = Loader.addSpritesheet(
  require("../../assets/images/gui.png"), {
    frames: {
      "button": { frame: {x: 0, y: 0, w: 55, h: 17} },
      "hover": { frame: {x: 0, y: 17, w: 55, h: 17} },
      "disabled": { frame: {x: 0, y: 34, w: 55, h: 17} },
    }
  });


let selectSound = Loader.addSound(
  require("../../assets/sounds/menu-select.wav"));


interface ButtonConfig {
  label: string;
  action: Function;
  position: Vector;
  enabled?: boolean;
}


export class Button extends Gui {
  private label: px.Text;
  private background: Sprite;
  private action: Function;

  public constructor(engine: Engine, config: ButtonConfig) {
    super("Button", engine);
    this.action = config.action;

    let bgX = 55 * 3;
    let bgY = 17 * 3;
    let padd = 14;

    let labelPos = new Vector(
      config.position.x - bgX / 2 + padd,
      config.position.y - Gui.textStyle.fontSize / 2);

    this.label = this.addText(config.label, labelPos);
    this.label.zIndex = 10;

    let enabled = config.enabled === undefined || config.enabled;

    this.background = this.add(new Sprite(engine, this, {
      kind: "static",
      asset: buttonTexture,
      name: enabled ? "button" : "disabled",
      position: config.position,
      scale: new Vector(3, 3),
      zIndex: 9,
      button: enabled
    }));

    if (enabled) {
      this.background.events.on("mouse-over", this.hoverOn, this);
      this.background.events.on("mouse-out", this.hoverOff, this);
      this.background.events.on("click", this.onClick, this);
    }
  }

  private hoverOn() {
    this.background.changeTexture("static", buttonTexture, "hover");
  }

  private hoverOff() {
    this.background.changeTexture("static", buttonTexture, "button");
  }

  private onClick() {
    this.background.addEffect(Effect.FlashWhite);
    this.engine.delay(100, this.action);
    this.engine.loader.getSound(selectSound).play();
  }
}
