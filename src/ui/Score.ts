import * as px from "pixi.js";

import {Gui} from "../engine/Gui";
import {Engine} from "../engine/Engine";


export class Score extends Gui {
  private text: px.Text;

  public constructor(engine: Engine) {
    super("score", engine);

    this.text = new px.Text("Score 00000", Gui.textStyle);

    let screen = engine.getScreenBounds();
    this.text.position.x = screen.lowerBound.x + 30;
    this.text.position.y = screen.lowerBound.y + 20;

    engine.render.stage.addChild(this.text);
  }

  public delete() {
    this.engine.render.stage.removeChild(this.text);
  }

  public onScoreChanged(newScore: number) {
    this.text.text = "Score " + newScore.toString().padStart(5, "0");
  }
}
