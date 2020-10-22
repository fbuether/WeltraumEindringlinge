import {Gui} from "../engine/Gui";
import {Engine} from "../engine/Engine";


export class Button extends Gui {
  public constructor(engine: Engine, title: string, action: Function) {
    super("Button", engine);
  }
}
