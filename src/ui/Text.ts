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

  public get size(): Vector {
    return new Vector(
      this.text.width,
      this.text.height);
  }

  public constructor(engine: Engine, config: TextConfig) {
    super("score", engine);

    this.text = this.addText(config.text ?? "", config.position);
    this.text.zIndex = 10;
  }

  public setText(newText: string) {
    this.text.text = newText;
  }

  public moveTo(position: Vector) {
    this.text.position.x = position.x;
    this.text.position.y = position.y;
  }

  public setVisible(visible: boolean) {
    this.text.visible = visible;
  }
}
