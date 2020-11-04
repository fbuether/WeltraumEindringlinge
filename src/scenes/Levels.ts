
import {Engine} from "../engine/Engine";
import {Squadron, SquadronConfig} from "../actors/Squadron";
import {Ingame} from "../scenes/Ingame";
import {EnemyClass} from "../actors/Enemy";
import {PlayerShipType} from "../actors/Player";
import {Character} from "../ui/Dialogue";


interface Game {
  spawnSquadron(config: SquadronConfig): Promise<void>;
  spawnPlayer(shipType: PlayerShipType): Promise<void>;
  removePlayer(): Promise<void>;
  showDialogue(char: Character, text: Array<string>): Promise<void>;
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
  await game.showDialogue(Character.Commander, [
    "Greetings, pilot, this is\ncommand.",
    "You are assigned the K-21\nExperimental Prototype.",
    "Budget constrains you to left and\nright boosters, use `A` and `D`.",
    "The K-21 features FR-3 Twin\nLasers, use with `Space`.",
    "\"Space,\" get it?",
    "Anyway. Ahead are a group\nof the Impolite Ruffians,\nprepare to engage!",
    "There are only interceptors.\nNo weapons, but very explodey.",
    "Do not let any pass you!"
  ]);

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
  await game.showDialogue(Character.Commander, [
    "Additional intel just arrived.",
    "There are a couple of fighters\nas well.",
    "You are nearing the main bulk.\nTake them all out."
  ]);
  await engine.waitFor(500);

  let smalls = game.spawnSquadron({
    enemyClass: EnemyClass.Small,
    count: 22,
    spawnPackSize: [3,5],
    spawnPackLimit: 6,
    spawnPackDelay: 2500,
    spawnDelay: 4000,
    spawnRandom: [0, 1000]
  });


  let mediums = engine.waitFor(5000).then(() =>
    game.spawnSquadron({
      enemyClass: EnemyClass.Medium1,
      count: 3,
      spawnPackSize: [1,2],
      spawnPackLimit: 2,
      spawnDelay: 1100,
      spawnPackDelay: 1000,
      spawnRandom: [0,1500]
    }));

  await Promise.all([smalls, mediums]);

  await engine.waitFor(1600);

  await game.spawnSquadron({
    enemyClass: EnemyClass.Small,
    count: 1,
    spawnDelay: 100,
    spawnPackDelay: 110,
    spawnPackLimit: 1,
    spawnPackSize: [0,0],
    spawnRandom: [0,0]
  });

  await engine.waitFor(200);

  await game.showDialogue(Character.Commander, [
    "That was the last. Well\ndone, pilot!",
    "Return teleport will commence\nimmediately.",
    "Command out."
  ]);

  await engine.waitFor(400);
  await game.removePlayer();
  await engine.waitFor(200);
  game.win();
}
