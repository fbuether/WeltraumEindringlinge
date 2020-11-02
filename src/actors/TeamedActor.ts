
import {Component} from "../engine/components/Component";
import {Actor} from "../engine/Actor";
import {Engine} from "../engine/Engine";


export enum Team {
  Player,
  Enemy,
  Neutral
}


export abstract class TeamedActor extends Actor {
  public readonly team: Team;

  protected alive: boolean = true;

  constructor(name: string, engine: Engine, team: Team) {
    super(name, engine);
    this.team = team;
  }

  // damages this actor.
  // returns true if the actor consumed all damage.
  // if it returns false, the damage dealer may continue to deal damage.
  public abstract damage(amount: number): boolean;


  public abstract receivesBulletDamage(): boolean;


  protected add<T extends Component>(component: T): T {
    if (!this.alive) {
      throw new Error("added component to dead team actor.");
    }

    return super.add(component);
  }


  public kill() {
    if (!this.alive) {
      return;
    }

    super.kill();
    this.alive = false;
  }
}
