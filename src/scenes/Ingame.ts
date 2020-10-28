
import {Engine} from "../engine/Engine";
import {Scene} from "../engine/Scene";
import {Player} from "../actors/Player";
import {Starfield} from "../actors/Starfield";
import {Vector} from "../engine/Vector";
import {Squadron} from "../actors/Squadron";
import {Enemy} from "../actors/Enemy";
import {Score} from "../ui/Score";
import {Banner} from "../ui/Banner";


export class Ingame extends Scene {
  private guiScore: Score;
  public score = 0;

  private state: "running" | "finished" = "running";

  public constructor(engine: Engine) {
    super("ingame", engine);

    this.add(new Starfield(engine));


    let screen = engine.getScreenBounds();
    let player = new Player(engine, new Vector(
      (screen.left + screen.right) / 2,
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
