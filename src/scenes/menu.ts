import * as ex from "excalibur";

import {Starfield} from "../actors/starfield";
import {Button} from "../ui/button";


export class Menu extends ex.Scene {


  public onInitialize(engine: ex.Engine) {
    this.camera.zoom(1);
    this.camera.pos = new ex.Vector(0, 0);

    this.add(new Starfield());

    this.add(new Button("Start", () => {
      console.log("started!");
    }));

  }
}
