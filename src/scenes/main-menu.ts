import * as ex from "excalibur";

import {Starfield} from "../actors/starfield";

import {SceneWithUI} from "../scenes/scene-with-ui";
import {Ingame} from "../scenes/ingame";
import {Button} from "../ui/button";
import {Menu} from "../ui/menu";


export class MainMenu extends SceneWithUI {
  private engine: ex.Engine;


  public constructor(engine: ex.Engine) {
    super(engine);
    this.engine = engine;
  }


  public onInitialize(engine: ex.Engine) {
    super.onInitialize(engine);
    this.add(new Starfield());
  }

  public onActivate(oldScene: ex.Scene, newScene: ex.Scene) {
    super.onActivate(oldScene, newScene);

    this.camera.zoom(1);
    this.camera.pos = new ex.Vector(0, 0);

    this.addUi(new Menu(
      new Array<Button>(
        new Button("Start", () => {
          Ingame.startGame(this.engine);
        })
      ), true));
  }
}
