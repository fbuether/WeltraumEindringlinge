import * as EventEmitter from "eventemitter3";

import {Gui} from "../engine/Gui";
import {Sprite} from "../engine/components/Sprite";
import {Engine} from "../engine/Engine";
import {Scene} from "../engine/Scene";
import {Player, PlayerShipType} from "../actors/Player";
import {Starfield} from "../actors/Starfield";
import {Vector} from "../engine/Vector";
import {Squadron, SquadronConfig} from "../actors/Squadron";
import {Enemy} from "../actors/Enemy";
import {Text} from "../ui/Text";
import {Banner} from "../ui/Banner";
import {Loader} from "../engine/Loader";
import {Button} from "../ui/Button";
import {MainMenu} from "../scenes/MainMenu";
import {Levels} from "../scenes/Levels";
import {Component} from "../engine/components/Component";
import {Dialogue, Character} from "../ui/Dialogue";


let backgrounds = [
  Loader.addSprite(require("../../assets/images/background-heic1608a.png")),
  Loader.addSprite(require("../../assets/images/background-heic1808a.png"))
];

let beamTexture = Loader.addSpritesheet(
  require("../../assets/images/beaming.png"), {
    frames: {
      "1": { frame: {x: 0 * 48, y: 0 * 48, w: 48, h: 48 } },
      "2": { frame: {x: 1 * 48, y: 0 * 48, w: 48, h: 48 } },
      "3": { frame: {x: 2 * 48, y: 0 * 48, w: 48, h: 48 } },
      "4": { frame: {x: 3 * 48, y: 0 * 48, w: 48, h: 48 } },
      "5": { frame: {x: 0 * 48, y: 1 * 48, w: 48, h: 48 } },
      "6": { frame: {x: 1 * 48, y: 1 * 48, w: 48, h: 48 } },
      "7": { frame: {x: 2 * 48, y: 1 * 48, w: 48, h: 48 } },
      "8": { frame: {x: 3 * 48, y: 1 * 48, w: 48, h: 48 } }
    },
    animations: {
      "beam": ["1", "2", "3", "4", "5", "6", "7", "8"]
    }
  });

const beamSound = Loader.addSound(
  require("../../assets/sounds/beam.wav"));



type Events = "score-changed";

export class Ingame extends Scene {
  private readonly events = new EventEmitter<Events>();
  private uiComponents = new Array<Component>();
  private player: Player | null = null;
  public score = 0;

  private backgroundSprite: Sprite;
  private static readonly backgroundSpeed = 0.008;
  private backgroundMaxY: number = Number.POSITIVE_INFINITY;

  private state: "running" | "finished" = "running";

  public constructor(engine: Engine) {
    super("ingame", engine);

    this.backgroundSprite = this.loadNextBackground();
    this.add(new Starfield(engine));

    engine.onNextUpdate(() => {
      Levels[1].run(engine, this);
    });
  }

  public update(delta: number) {
    let bsPos = this.backgroundSprite.position;

    this.backgroundSprite.move(
      new Vector(bsPos.x, bsPos.y + delta * Ingame.backgroundSpeed));

    if (bsPos.y > this.backgroundMaxY) {
      this.engine.remove(this.backgroundSprite);
      this.backgroundSprite = this.loadNextBackground();
    }
  }

  private loadNextBackground(): Sprite {
    let idx = this.engine.random.int(0, backgrounds.length - 1);
    let sprite = new Sprite(this.engine, this, {
      kind: "static",
      asset: backgrounds[idx],
      position: new Vector(0, 0),
      scale: new Vector(6,6),
      zIndex: -90
    });

    let screen = this.engine.getScreenBounds();
    sprite.move(new Vector(
      (screen.left + screen.right) / 2,
      -sprite.size.y/2 + (screen.bottom - screen.top) / 3
    ));

    this.backgroundMaxY = sprite.size.y/2 + (screen.bottom - screen.top);
    return this.add(sprite);
  }


  public async spawnSquadron(config: SquadronConfig) {
    return new Promise<void>((resolve, reject) => {
      let squad = this.add(new Squadron(this.engine, config));
      squad.events.on("enemy-destroyed", this.onEnemyDestroyed, this);
      squad.events.on("enemy-escaped", this.onEnemyEscaped, this);
      squad.events.on("squad-destroyed", () => { resolve(); });
    });
  }

  public async spawnPlayer(shipType: PlayerShipType) {
    let screen = this.engine.getScreenBounds();
    let horizontalCenter = (screen.left + screen.right) / 2;
    let playerPos = new Vector(horizontalCenter, screen.bottom - 90);

    return new Promise<void>((resolve, reject) => {

      let beaming = this.add(new Sprite(this.engine, this, {
        kind: "animated",
        asset: beamTexture,
        animation: "beam",
        loops: false,
        speed: 0.4,
        position: playerPos,
        onComplete: () => {
          this.engine.remove(beaming);
          resolve();
        },
        scale: new Vector(3, 3),
        zIndex: 3
      }));

      this.engine.loader.getSound(beamSound).play();

      // on the right moment during beaming...
      this.engine.delay(4 * 400 + 200, () => this.addPlayer(playerPos));
    });
  }

  private addPlayer(pos: Vector) {
    let screen = this.engine.getScreenBounds();

    this.player = this.add(new Player(this.engine, pos));
    this.player.events.on("destroyed", this.onPlayerDestroyed, this);

    this.engine.delay(600, () => {
      if (this.player != null) {
        this.player.setReceivesInput(true);
      }
    });

    // ui.

    // score display.

    let uiScore = this.add(new Text(this.engine, {
      position: new Vector(screen.left + 30, screen.top + 20),
      text: "Score 00000"
    }));
    let setScoreDisplay = (score: number) => {
      uiScore.setText("Score " + score.toString().padStart(5, "0"));
    };

    this.events.on("score-changed", setScoreDisplay);
    this.uiComponents.push(uiScore);

    // health display.

    let uiHealth = this.add(new Text(this.engine, {
      position: new Vector(screen.left + 30, screen.bottom -
          Gui.textStyle.fontSize - 20),
      text: "Health 006"
    }));

    let setHealthDisplay = () => {
      if (this.player != null) {
        uiHealth.setText("Health " +
            this.player.health.toString().padStart(3, "0"));
      }
    };

    this.player.events.on("health-changed", setHealthDisplay);
    setHealthDisplay();
    this.uiComponents.push(uiHealth);
  }

  public async removePlayer() {
    if (this.player == null) {
      return;
    }

    this.player.setReceivesInput(false);

    return new Promise<void>((resolve, reject) => {
      if (this.player == null) {
        resolve();
        return;
      }

      let beaming = this.add(new Sprite(this.engine, this, {
        kind: "animated",
        asset: beamTexture,
        animation: "beam",
        loops: false,
        speed: 0.4,
        position: this.player.position,
        onComplete: () => {
          this.engine.remove(beaming);
          resolve();
        },
        scale: new Vector(3, 3),
        zIndex: 3
      }));

      this.engine.loader.getSound(beamSound).play();

      this.engine.delay(4 * 400 + 200, () => {
        if (this.player != null) {
          this.engine.remove(this.player);
          this.player = null;
        }

        for (let component of this.uiComponents) {
          this.engine.remove(component);
        }

        this.uiComponents = new Array<Component>();
      });
    });
  }

  public async showDialogue(char: Character, text: Array<string>) {
    let dialogue = this.add(new Dialogue(this.engine, char, text));

    return new Promise<void>((resolve, reject) => {
      dialogue.events.on("finished", () => {
        this.engine.remove(dialogue);
        resolve();
      });
    });
  }


  public win() {
    this.finishGame("YOU WIN", "Final score: " +
        this.score.toString().padStart(5, "0"));
  }




  private onEnemyDestroyed(squadron: Squadron, enemy: Enemy) {
    this.score += 1;
    this.events.emit("score-changed", this.score);
  }

  private onEnemyEscaped(squadron: Squadron, enemy: Enemy) {
    this.finishGame("YOU LOSE", "An enemy passed by!");
  }

  private onPlayerDestroyed(player: Player) {
    this.finishGame("YOU LOSE", "You have been destroyed.");
  }


  private finishGame(title: string, subtitle: string) {
    if (this.state != "running") {
      return;
    }

    window.localStorage.setItem("highscore", this.score.toString());

    this.state = "finished";

    this.engine.delay(800, () => {
      this.add(new Banner(this.engine, title, subtitle));

      let screen = this.engine.getScreenBounds();

      this.add(new Button(this.engine, {
        label: "Exit",
        action: () => this.engine.toScene(MainMenu),
        position: new Vector(
          screen.left + (screen.right - screen.left) * 3 / 4,
          screen.bottom - 200)
      }));
    });
  }
}
