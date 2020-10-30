
import {Component} from "../../engine/components/Component";


export abstract class Updatable extends Component {
  public abstract update(delta: number): void;

  public static isUpdatable(obj: Object): obj is Updatable {
    return (obj as Updatable).update !== undefined &&
        typeof((obj as Updatable).update) == "function";
  }
}
