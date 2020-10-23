
import {Engine} from "../engine/Engine";

import {Scene} from "../engine/Scene";
import {Starfield} from "../actors/Starfield";
import {Button} from "../ui/Button";
import {Menu} from "../ui/Menu";
import {Ingame} from "../scenes/Ingame";


export class MainMenu extends Scene {
  public constructor(engine: Engine) {
    super("main-menu", engine);

    this.add(new Starfield(engine));
  }
}

