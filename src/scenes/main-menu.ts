import * as ex from "excalibur";

import {Starfield} from "../actors/starfield";
import {Button} from "../ui/button";
import {Menu} from "../ui/menu";


export class MainMenu extends ex.Scene {
  public onInitialize(engine: ex.Engine) {
    this.camera.zoom(1);
    this.camera.pos = new ex.Vector(0, 0);

    this.add(new Starfield());

    this.add(new Menu(
      new Array<Button>(
        new Button("Start", () => {
        engine.goToScene("ingame");
        })
      ), true));
  }

  public onActivate() {
  }

  public onDeactivate() {
  }
}
