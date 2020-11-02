import * as px from "pixi.js";

import {Vector} from "../engine/Vector";
import {Loader} from "../engine/Loader";
import {Sprite, Effect} from "../engine/components/Sprite";
import {Gui} from "../engine/Gui";
import {Engine} from "../engine/Engine";


let buttonTexture = Loader.addSpritesheet(
  require("../../assets/images/gui.png"), {
    frames: {
      "button": { frame: {x: 0, y: 0, w: 45, h: 17} },
      "hover":  { frame: {x: 0, y: 17, w: 45, h: 17} },
    }
  });


interface ButtonConfig {
  label: string;
  action: Function;
  position: Vector;
}


export class Button extends Gui {
  private label: px.Text;
  private background: Sprite;
  private hover: Sprite;
  private action: Function;

  public constructor(engine: Engine, config: ButtonConfig) {
    super("Button", engine);
    this.action = config.action;

    let bgX = 45 * 3;
    let bgY = 17 * 3;
    let padd = 14;

    let labelPos = new Vector(
      config.position.x - bgX / 2 + padd,
      config.position.y - Gui.textStyle.fontSize / 2);

    this.label = this.addText(config.label, labelPos);
    this.label.zIndex = 10;

    this.background = new Sprite(engine, this, {
      kind: "static",
      asset: buttonTexture,
      name: "button",
      position: config.position,
      scale: new Vector(3, 3),
      zIndex: 9,
      interactive: true
    });

    this.hover = new Sprite(engine, this, {
      kind: "static",
      asset: buttonTexture,
      name: "hover",
      position: config.position,
      scale: new Vector(3, 3),
      zIndex: 9,
      interactive: true
    });
    this.hover.setVisible(false);

    this.background.events.on("mouse-over", () => {
      this.background.setVisible(false);
      this.hover.setVisible(true);
      document.body.style.cursor = "pointer";
    });

    this.hover.events.on("mouse-out", () => {
      this.background.setVisible(true);
      this.hover.setVisible(false);
      document.body.style.cursor = "default";
    });

    this.hover.events.on("click", this.onClick, this);
    this.background.events.on("click", this.onClick, this);

    this.add(this.hover);
    this.add(this.background);
  }

  private onClick() {
    this.hover.addEffect(Effect.FlashWhite);
    this.background.addEffect(Effect.FlashWhite);
    document.body.style.cursor = "default";
    this.engine.delay(100, this.action);
  }
}
