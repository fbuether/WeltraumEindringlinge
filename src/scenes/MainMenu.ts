
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
