import * as ex from "excalibur";

import {Starfield} from "../actors/starfield";
import {Button} from "../ui/button";


export class MainMenu extends ex.Scene {


  public onInitialize(engine: ex.Engine) {
    this.camera.zoom(1);
    this.camera.pos = new ex.Vector(0, 0);

    this.add(new Starfield());

    this.add(new Button("Start", () => {
      engine.goToScene("ingame");
    }));
  }

  public onDeactivate() {
    while (this.screenElements.length > 0) {
      this.screenElements[0].kill();
    }
  }
}
