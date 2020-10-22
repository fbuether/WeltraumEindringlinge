
import {Gui} from "../engine/Gui";
import {Button} from "../ui/Button";
import {Engine} from "../engine/Engine";


export class Menu extends Gui {

  public constructor(engine: Engine, buttons: Array<Button>, withTitle: boolean) {
    super("Menu", engine);
  }

}
