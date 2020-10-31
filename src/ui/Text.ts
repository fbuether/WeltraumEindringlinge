import * as px from "pixi.js";

import {Gui} from "../engine/Gui";
import {Engine} from "../engine/Engine";
import {Vector} from "../engine/Vector";


interface TextConfig {
  position: Vector;
  text?: string;
}



export class Text extends Gui {
  private text: px.Text;

  public constructor(engine: Engine, config: TextConfig) {
    super("score", engine);

    this.text = new px.Text(config.text ?? "", Gui.textStyle);
    this.text.position.x = config.position.x;
    this.text.position.y = config.position.y;

    this.text.zIndex = 10;

    engine.render.stage.addChild(this.text);
  }

  public delete() {
    this.engine.render.stage.removeChild(this.text);
  }

  public setText(newText: string) {
    this.text.text = newText;
  }
}
