
import {Component} from "../engine/components/Component";
import {Updatable} from "../engine/components/Updatable";
import {Engine} from "../engine/Engine";


export class Actor extends Updatable {
  protected readonly components = new Set<Component>();

  protected engine: Engine;

  constructor(engine: Engine) {
    super();
    this.engine = engine;
  }


  protected add(component: Component) {
    this.components.add(component);
  }

  public getComponents(): ReadonlySet<Component> {
    return this.components;
  }


  // Empty to not force implementation.
  public update(delta: number) {
  }


  public kill() {
    this.engine.remove(this);
  }
}
