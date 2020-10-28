
import {Engine} from "../engine/Engine";
import {Scene} from "../engine/Scene";
import {Player} from "../actors/Player";
import {Starfield} from "../actors/Starfield";
import {Vector} from "../engine/Vector";
import {Squadron} from "../actors/Squadron";
import {Enemy} from "../actors/Enemy";
import {Score} from "../ui/Score";


export class Ingame extends Scene {

  private guiScore: Score;

  public score = 0;

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
    this.add(squadron);


    // ui.
    this.guiScore = new Score(engine);
    this.add(this.guiScore);
  }

  private onEnemyDestroyed(squadron: Squadron, enemy: Enemy) {
    this.score += 1;
    this.guiScore.onScoreChanged(this.score);
  }
}


/*
    // ui.
    this.scoreUi.onScoreChanged(this.score);
    this.addUi(this.scoreUi);
    this.addUi(new Energy(player));

    // enemies
    let squadron = new Squadron(
      this.onSquadronKilled.bind(this),
      this.onEnemyKilled.bind(this));
    this.add(squadron);

    // prepare dramatic zoom in.
    this.camera.zoom(0.1);
    this.camera.pos = new ex.Vector(0, 0);

    this.state = "ingame";
  }

  private onEnemyKilled() {
    if (this.state != "ingame") {
      return;
    }

    this.score += 1;
    this.scoreUi.onScoreChanged(this.score);
  }

  private onSquadronKilled() {
    if (this.state != "ingame") {
      return;
    }

    let timer = new ex.Timer({
      interval: 500,
      repeats: false,
      fcn: () => {
        this.removeTimer(timer);
        this.finishGame();
      }
    });

    this.add(timer);
  }

  private finishGame() {
    if (this.state != "ingame") {
      return;
    }

    this.state = "finished";

    this.addUi(new Banner("You win!", "Score: " + this.score));
    this.addUi(new Menu(new Array<Button>(
      new Button("New Game", () => {
        Ingame.startGame(this.engine);
      }),
      new Button("Return to Menu", () => {
        this.engine.goToScene("main-menu");
      })
    ), false));
  }
}
*/
