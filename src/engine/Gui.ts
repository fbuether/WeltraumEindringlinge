import * as px from "pixi.js";

import {Vector} from "../engine/Vector";
import {Actor} from "../engine/Actor";

let font = require(
  "../../assets/fonts/PressStart2P/PressStart2P-Regular.woff2");


export abstract class Gui extends Actor {
  public static textStyle = {
    fontFamily: "VT323",
    fontSize: 17,
    lineHeight: 21,
    fill: "white"
  };

  private static initialised: boolean = false;

  private pxObjs = new Array<px.Sprite>();

  // called by Engine as part of asset loading.
  public static async loadFonts() {
    if (!Gui.initialised) {
      let face = new FontFace("VT323", `url(${font.default}) format("woff2")`);
      await face.load();
      document.fonts.add(face);
      Gui.initialised = true;
    }
  }

  protected addText(label: string, position: Vector,
      config?: px.TextStyle): px.Text {

    let text = new px.Text(label, {
      ...Gui.textStyle,
      ...config
    });
    text.position.x = position.x;
    text.position.y = position.y;
    this.pxObjs.push(text);
    this.engine.render.stage.addChild(text);
    return text;
  }

  public delete() {
    for (let pxObj of this.pxObjs) {
      this.engine.render.stage.removeChild(pxObj);
    }
  }
}
