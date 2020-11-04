
import {Engine} from "../engine/Engine";
import {Squadron, SquadronConfig} from "../actors/Squadron";
import {Ingame} from "../scenes/Ingame";
import {EnemyClass} from "../actors/Enemy";
import {PlayerShipType} from "../actors/Player";


interface Game {
  spawnSquadron(config: SquadronConfig): Promise<void>;
  spawnPlayer(shipType: PlayerShipType): Promise<void>;
  removePlayer(): Promise<void>;
  win(): void;
}


interface Level {
  run: (engine: Engine, game: Game) => Promise<void>;
}


export const Levels: Record<number, Level> = {
  1: {
    run: level1
  }
};


async function level1(engine: Engine, game: Game) {

  await engine.waitFor(500);
  await game.spawnPlayer("small");

  await engine.waitFor(1000);
  await game.spawnSquadron({
    enemyClass: EnemyClass.Small,
    count: 14,
    spawnPackSize: [1,3],
    spawnPackLimit: 3,
    spawnPackDelay: 2000,
    spawnDelay: 6000,
    spawnRandom: [0, 1000]
  });

  await engine.waitFor(1000);

  await game.spawnSquadron({
    enemyClass: EnemyClass.Small,
    count: 18,
    spawnPackSize: [2,4],
    spawnPackLimit: 4,
    spawnPackDelay: 3000,
    spawnDelay: 5000,
    spawnRandom: [0, 1000]
  });

  await engine.waitFor(1000);

  await game.spawnSquadron({
    enemyClass: EnemyClass.Small,
    count: 22,
    spawnPackSize: [3,5],
    spawnPackLimit: 6,
    spawnPackDelay: 2500,
    spawnDelay: 4000,
    spawnRandom: [0, 1000]
  });

  await engine.waitFor(1600);
  await game.removePlayer();
  await engine.waitFor(200);
  game.win();



  let speech = [
    "Welcome to your first assignment, pilot.",
    "You are flying the K-21 Experimental Prototype.",
    "Budget constrains you to left and right boosters, use `A` and `D`.",
    "You have two FR-3 Twin Lasers, use with `Space`.",
    "\"Space,\" you get it?",
    "Anyway. You are nearing a group of the Impolite Ruffians, prepare yourself.",
    "They are interceptors; No weapons, but very explodey.",
    "Do not let any pass you!",
    "Oh, there seems to be a fighter among them. Take it down.",
    "Well done, pilot! Return home."
  ];

}
