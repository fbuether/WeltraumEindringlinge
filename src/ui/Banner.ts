import * as px from "pixi.js";

import {Gui} from "../engine/Gui";
import {Engine} from "../engine/Engine";


export class Banner extends Gui {
  private title: px.Text;
  private subtitle: px.Text;
  private graphics: px.Graphics;

  public constructor(engine: Engine, title: string, subtitle: string,
      yPos: number = 1/3) {
    super("banner", engine);

    this.title = new px.Text(title, {
      ...Gui.textStyle,
      fontSize: 40,
      lineHeight: 40
    });
    this.subtitle = new px.Text(subtitle, { ...Gui.textStyle, fontSize: 28 });

    let screen = engine.getScreenBounds();
    this.title.position.x =
        (screen.left + screen.right - this.title.width) / 2;
    this.title.position.y =
        screen.top + (screen.bottom - screen.top) * yPos;

    this.subtitle.position.x =
        (screen.left + screen.right - this.subtitle.width) / 2;
    this.subtitle.position.y = this.title.position.y + 1.5 * this.title.height;

    this.graphics = new px.Graphics();
    this.graphics.beginFill(
      px.utils.rgb2hex([0.1, 0.1, 0.1]),
      0.7);
    this.graphics.drawRect(
      screen.left,
      this.title.position.y - 50,
      screen.right - screen.left,
      this.title.height * 1.5 + this.subtitle.height + 2 * 50);
    this.graphics.endFill();

    this.graphics.zIndex = 10;
    this.title.zIndex = 11;
    this.subtitle.zIndex = 12;

    engine.render.stage.addChild(this.graphics);
    engine.render.stage.addChild(this.title);
    engine.render.stage.addChild(this.subtitle);
  }

  public delete() {
    this.engine.render.stage.removeChild(this.title);
    this.engine.render.stage.removeChild(this.subtitle);
    this.engine.render.stage.removeChild(this.graphics);
  }
}
