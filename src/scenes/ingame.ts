import * as ex from "excalibur";

import {Player} from "../actors/player";
import {Starfield} from "../actors/starfield";
import {Squadron} from "../actors/squadron";
import {IncreaseScoreEvent} from "../actors/increase-score-event";

import {SceneWithUI} from "../scenes/scene-with-ui";
import {Score} from "../ui/score";
import {Energy} from "../ui/energy";
import {Banner} from "../ui/banner";
import {Button} from "../ui/button";
import {Menu} from "../ui/menu";


export class Ingame extends SceneWithUI {
  private static readonly kickoffDuration: number = 3000;

  private engine: ex.Engine;
  private scoreUi: Score;

  private state: "ingame" | "finished" | "deactivated" = "deactivated";
  private score = 0;

  public constructor(engine: ex.Engine) {
    super(engine);
    this.engine = engine;

    this.scoreUi = new Score();
  }


  public static startGame(engine: ex.Engine) {
    engine.removeScene("ingame");
    engine.addScene("ingame", new Ingame(engine));
    engine.goToScene("ingame");
  }

  public onActivate(oldScene: ex.Scene, newScene: ex.Scene) {
    super.onActivate(oldScene, newScene);

    this.setupNewGame();

    // dramatic zoom in
    this.camera.zoom(1, Ingame.kickoffDuration, ex.EasingFunctions.EaseOutQuad);
  }

  public onDeactivate(oldScene: ex.Scene, newScene: ex.Scene) {
    super.onDeactivate(oldScene, newScene);

    this.state = "deactivated";
    this.actors.forEach(a => { a.kill(); });
  }



  private setupNewGame() {
    this.clearUi();

    this.score = 0;

    // player
    let player = new Player();
    player.pos = new ex.Vector(0, this.engine.screen.viewport.height / 2 - 100);
    this.add(player);

    // background
    this.add(new Starfield());

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
