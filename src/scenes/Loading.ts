
import {Engine} from "../engine/Engine";
import {Scene, SceneConstructor} from "../engine/Scene";
import {Text} from "../ui/Text";
import {Vector} from "../engine/Vector";


export class Loading extends Scene {
  private static nextScene: SceneConstructor | null = null;
  private static loadAction: Function | null = null;

  public constructor(engine: Engine) {
    super("loading", engine);

    let screen = engine.getScreenBounds();
    let text = this.add(new Text(engine, {
      position: new Vector(0, 0),
      text: "Loading..."
    }));

    text.moveTo(new Vector(
      (screen.left + screen.right - text.size.x) / 2,
      (screen.top + screen.bottom) / 2));
  }
}
