
import {Engine} from "../engine/Engine";
import {Scene} from "../engine/Scene";
import {Player} from "../actors/Player";
import {Starfield} from "../actors/Starfield";
import {Vector} from "../engine/Vector";
import {Squadron} from "../actors/Squadron";
import {Score} from "../ui/Score";


export class Ingame extends Scene {

  public score = 0;

  public constructor(engine: Engine) {
    super(engine);

    this.add(new Starfield(engine));


    let screen = engine.getScreenBounds();
    let player = new Player(engine, new Vector(
      screen.lowerBound.x + screen.upperBound.y / 2,
      screen.upperBound.y - 70));
    this.add(player);


    this.add(new Squadron(engine, this));


    // ui.
    this.add(new Score(engine));

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
