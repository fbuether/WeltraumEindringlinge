import * as px from "pixi.js";



// internally uses pixi colours.
export class Colour {
  private red: number;
  private green: number;
  private blue: number;

  private constructor(red: number, green: number, blue: number) {
    this.red = red;
    this.green = green;
    this.blue = blue;
  }

  public toPixi() {
    return px.utils.rgb2hex([this.red, this.green, this.blue]);
  }


  public static white: Colour = new Colour(1, 1, 1);

  public static ofRGB(red: number, green: number, blue: number): Colour {
    return new Colour(red, green, blue);
  }
}
