
import {Vector} from "../engine/Vector";
import {Engine} from "../engine/Engine";
import {Scene} from "../engine/Scene";
import {Starfield} from "../actors/Starfield";
import {Button} from "../ui/Button";
import {Banner} from "../ui/Banner";
import {Ingame} from "../scenes/Ingame";


export class MainMenu extends Scene {
  public constructor(engine: Engine) {
    super("main-menu", engine);

    this.add(new Starfield(engine));

    let screen = engine.getScreenBounds();

    this.add(new Banner(engine,
      "  WELTRAUM-\nEINDRINGLINGE", "ATTACK FROM OUTER SPACE!"));

    this.add(new Button(engine, {
      label: "Start",
      action: () => engine.toScene(Ingame),
      position: new Vector(
        screen.left + (screen.right - screen.left) / 4,
        screen.bottom - 200)
    }));
  }
}


/*
-import * as ex from "excalibur";
-
-import {Starfield} from "../actors/starfield";
-
-import {SceneWithUI} from "../scenes/scene-with-ui";
-import {Ingame} from "../scenes/ingame";
-import {Button} from "../ui/button";
-import {Menu} from "../ui/menu";
-
-
-export class MainMenu extends SceneWithUI {
-  private engine: ex.Engine;
-
-
-  public constructor(engine: ex.Engine) {
-    super(engine);
-    this.engine = engine;
-  }
-
-
-  public onInitialize(engine: ex.Engine) {
-    super.onInitialize(engine);
-    this.add(new Starfield());
-  }
-
-  public onActivate(oldScene: ex.Scene, newScene: ex.Scene) {
-    super.onActivate(oldScene, newScene);
-
-    this.camera.zoom(1);
-    this.camera.pos = new ex.Vector(0, 0);
-
-    this.addUi(new Menu(
-      new Array<Button>(
-        new Button("Start", () => {
-          Ingame.startGame(this.engine);
-        })
-      ), true));
-  }
-}
*/
