import * as ex from "excalibur";

import {UIContainer} from "../ui-container";
import {UIComponent} from "../ui/ui-component";


export class SceneWithUI extends ex.Scene {
  private ui = new UIContainer();

  public onActivate(oldScene: ex.Scene, newScene: ex.Scene) {
    super.onActivate(oldScene, newScene);
    this.ui.initialize();
  }

  public onPostUpdate(engine: ex.Engine, delta: number) {
    super.onPostUpdate(engine, delta);
    this.ui.update(delta);
  }

  public onDeactivate(oldScene: ex.Scene, newScene: ex.Scene) {
    super.onDeactivate(oldScene, newScene);
    this.ui.removeAll();
  }


  protected addUi(component: UIComponent) {
    this.ui.add(component);
  }

  protected clearUi() {
    this.ui.removeAll();
  }
}
