
import {Engine} from "../engine/Engine";
import {Actor} from "../engine/Actor";


export type SceneConstructor = new(engine: Engine) => Scene;

export abstract class Scene {
  protected readonly engine: Engine;

  protected readonly actors: Array<Actor> = new Array<Actor>();


  public constructor(engine: Engine) {
    this.engine = engine;
  }


  public add(actor: Actor): void {
    this.actors.push(actor);
    this.engine.add(actor);
  }


  public getActors(): Iterable<Actor> {
    return this.actors;
  }



  /**
   * Destroy this scene.
   * Override in subclasses to clean this scene up.
   */
  public onRemove() { }
}

