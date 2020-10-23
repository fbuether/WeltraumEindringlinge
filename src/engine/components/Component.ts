
import {Actor} from "../../engine/Actor";


export abstract class Component {
  private _: string;

  protected readonly parent: Component | null;

  public constructor(name: string, parent: Component | null) {
    this._ = name;
    this.parent = parent;
  }

  public getActor(): Actor {
    if (this instanceof Actor) {
      return this;
    }

    if (this.parent == null) {
      throw new Error(`Component ${this._} has no Actor in anchestry.`);
    }

    return this.parent.getActor();
  }

  public remove(): void {
    // not abstract to not force overriding.
  }
}
