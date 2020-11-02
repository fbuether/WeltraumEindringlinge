
import {Component} from "../engine/components/Component";
import {Updatable} from "../engine/components/Updatable";
import {Engine} from "../engine/Engine";


export class Actor extends Updatable {
  protected readonly components = new Set<Component>();

  protected engine: Engine;

  constructor(name: string, engine: Engine) {
    super(name, null);
    this.engine = engine;
  }


  protected add<T extends Component>(component: T): T {
    this.components.add(component);
    this.engine.add(component);
    return component;
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
