
import {Actor} from "../engine/Actor";
import {Engine} from "../engine/Engine";


export enum Team {
  Player,
  Enemy,
  Neutral
}


export abstract class TeamedActor extends Actor {
  public readonly team: Team;

  constructor(name: string, engine: Engine, team: Team) {
    super(name, engine);
    this.team = team;
  }

  // damages this actor.
  // returns true if the actor consumed all damage.
  // if it returns false, the damage dealer may continue to deal damage.
  public abstract damage(amount: number): boolean;
}
