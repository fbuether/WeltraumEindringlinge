import {Actor} from "../engine/Actor";

let font = require(
  "../../assets/fonts/PressStart2P/PressStart2P-Regular.woff2");


export abstract class Gui extends Actor {
  public static textStyle = {
    fontFamily: "VT323",
    fontSize: 17,
    fill: "white"
  };

  private static initialised: boolean = false;

  // called by Engine as part of asset loading.
  public static async loadFonts() {
    if (!Gui.initialised) {
      let face = new FontFace("VT323", `url(${font.default}) format("woff2")`);
      await face.load();
      document.fonts.add(face);
      Gui.initialised = true;
    }
  }
}
