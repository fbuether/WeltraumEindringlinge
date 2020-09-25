import * as ex from "excalibur";

import {Starfield} from "../actors/starfield";

import {SceneWithUI} from "../scenes/scene-with-ui";
import {Button} from "../ui/button";
import {Menu} from "../ui/menu";


export class MainMenu extends SceneWithUI {
  public onInitialize(engine: ex.Engine) {
    super.onInitialize(engine);

    this.camera.zoom(1);
    this.camera.pos = new ex.Vector(0, 0);

    this.add(new Starfield());

    this.addUi(new Menu(
      new Array<Button>(
        new Button("Start", () => {
        engine.goToScene("ingame");
        })
      ), true));
  }
}
