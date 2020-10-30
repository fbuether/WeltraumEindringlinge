
import {Vector} from "../../engine/Vector";


export abstract class Positioned {
  public abstract get position(): Vector;

  public static isPositioned(obj: Object): obj is Positioned {
    return (obj as Positioned).position !== undefined;
  }
}
