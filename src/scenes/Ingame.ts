
import {Sprite} from "../engine/components/Sprite";
import {Engine} from "../engine/Engine";
import {Scene} from "../engine/Scene";
import {Player} from "../actors/Player";
import {Starfield} from "../actors/Starfield";
import {Vector} from "../engine/Vector";
import {Squadron} from "../actors/Squadron";
import {Enemy} from "../actors/Enemy";
import {Score} from "../ui/Score";
import {Banner} from "../ui/Banner";
import {Loader} from "../engine/Loader";


const backgrounds = [
  Loader.addSprite(require("../../assets/images/background-heic1608a.png")),
  Loader.addSprite(require("../../assets/images/background-heic1808a.png"))
];


export class Ingame extends Scene {
  private guiScore: Score;
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
    let horizontalCenter = (screen.left + screen.right) / 2;
    let player = new Player(engine, new Vector(horizontalCenter,
      screen.bottom - 70));
    this.add(player);


    let squadron = new Squadron(engine);
    squadron.events.on("enemy-destroyed", this.onEnemyDestroyed, this);
    squadron.events.on("enemy-escaped", this.onEnemyEscaped, this);
    squadron.events.on("squad-destroyed", this.onSquadDestroyed, this);
    this.add(squadron);


    // ui.
    this.guiScore = new Score(engine);
    this.add(this.guiScore);
  }


  public update(delta: number) {
    let bsPos = this.backgroundSprite.position;

    this.backgroundSprite.move(
      new Vector(bsPos.x, bsPos.y + delta * Ingame.backgroundSpeed));

    if (bsPos.y > this.backgroundMaxY) {
      this.engine.remove(this.backgroundSprite);
      this.components.delete(this.backgroundSprite);
      this.backgroundSprite = this.loadNextBackground();
    }
  }

  private loadNextBackground(): Sprite {
    let idx = this.engine.random.int32(0, backgrounds.length - 1);
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
    return sprite;
  }


  private onEnemyDestroyed(squadron: Squadron, enemy: Enemy) {
    this.score += 1;
    this.guiScore.onScoreChanged(this.score);
  }

  private onEnemyEscaped(squadron: Squadron, enemy: Enemy) {
    this.finishGame("YOU LOSE", "An enemy passed by!");
  }

  private onSquadDestroyed(squadron: Squadron) {
    this.finishGame("YOU WIN", "Final score: " +
        this.score.toString().padStart(5, "0"));
  }

  private finishGame(title: string, subtitle: string) {
    if (this.state != "running") {
      return;
    }

    this.state = "finished";

    this.engine.delay(800, () => {
      this.add(new Banner(this.engine, title, subtitle));


// -    this.addUi(new Menu(new Array<Button>(
// -      new Button("New Game", () => {
// -        Ingame.startGame(this.engine);
// -      }),
// -      new Button("Return to Menu", () => {
// -        this.engine.goToScene("main-menu");
// -      })
    });
  }
}
