
import {Gui} from "../engine/Gui";
import {Sprite} from "../engine/components/Sprite";
import {Engine} from "../engine/Engine";
import {Scene} from "../engine/Scene";
import {Player} from "../actors/Player";
import {Starfield} from "../actors/Starfield";
import {Vector} from "../engine/Vector";
import {Squadron} from "../actors/Squadron";
import {Enemy} from "../actors/Enemy";
import {Text} from "../ui/Text";
import {Banner} from "../ui/Banner";
import {Loader} from "../engine/Loader";
import {Button} from "../ui/Button";
import {MainMenu} from "../scenes/MainMenu";


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


export class Ingame extends Scene {
  private guiScore: Text;
  private guiHealth: Text;
  public score = 0;

  private backgroundSprite: Sprite;
  private static readonly backgroundSpeed = 0.008;
  private backgroundMaxY: number = Number.POSITIVE_INFINITY;

  private state: "running" | "finished" = "running";

  public constructor(engine: Engine) {
    super("ingame", engine);


    this.backgroundSprite = this.loadNextBackground();
    this.add(new Starfield(engine));

    let screen = engine.getScreenBounds();

    // introductory animation.
    this.engine.delay(800, () => {
      let horizontalCenter = (screen.left + screen.right) / 2;
      let playerPos = new Vector(horizontalCenter, screen.bottom - 90);

      let beaming = this.add(new Sprite(engine, this, {
        kind: "animated",
        asset: beamTexture,
        animation: "beam",
        loops: false,
        speed: 0.4,
        position: playerPos,
        onComplete: () => {
          engine.remove(beaming);
        },
        scale: new Vector(3, 3),
        zIndex: 3
      }));

      // on the right moment during beaming...
      this.engine.delay(4 * 400 + 200, () => this.addPlayer(playerPos));
    });

    this.engine.delay(5000, () => {
      // start the level.
      let squadron = new Squadron(engine, 100);
      squadron.events.on("enemy-destroyed", this.onEnemyDestroyed, this);
      squadron.events.on("enemy-escaped", this.onEnemyEscaped, this);
      squadron.events.on("squad-destroyed", this.onSquadDestroyed, this);
      this.add(squadron);
    });

    // ui.
    this.guiScore = this.add(new Text(engine, {
      position: new Vector(screen.left + 30, screen.top + 20),
      text: "Score 00000"
    }));

    this.guiHealth = this.add(new Text(engine, {
      position: new Vector(screen.left + 30, screen.bottom -
          Gui.textStyle.fontSize - 20),
      text: "Health 00000"
    }));

    this.guiHealth.setVisible(false);
    this.guiScore.setVisible(false);
  }

  private addPlayer(pos: Vector) {
    let player = new Player(this.engine, pos);
    player.events.on("destroyed", this.onPlayerDestroyed, this);
    this.add(player);

    player.events.on("health-changed", this.onPlayerHealthChanged, this);
    this.onPlayerHealthChanged(player);

    this.guiHealth.setVisible(true);
    this.guiScore.setVisible(true);
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


  private onEnemyDestroyed(squadron: Squadron, enemy: Enemy) {
    this.score += 1;
    this.guiScore.setText("Score " + this.score.toString().padStart(5, "0"));
  }

  private onEnemyEscaped(squadron: Squadron, enemy: Enemy) {
    this.finishGame("YOU LOSE", "An enemy passed by!");
  }

  private onSquadDestroyed(squadron: Squadron) {
    this.finishGame("YOU WIN", "Final score: " +
        this.score.toString().padStart(5, "0"));
  }

  private onPlayerHealthChanged(player: Player) {
    this.guiHealth.setText(
      "Health " + player.health.toString().padStart(3, "0"));
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
