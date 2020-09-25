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

  private state: "ingame" | "finished" | "deactivated" = "deactivated";
  private score = 0;

  public constructor(engine: ex.Engine) {
    super(engine);
    this.engine = engine;
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
  }

  private setupNewGame() {
    this.actors.forEach(a => { a.kill(); });
    this.clearUi();

    // player
    let player = new Player();
    player.pos = new ex.Vector(0, this.engine.screen.viewport.height / 2 - 100);
    this.add(player);

    // background
    this.add(new Starfield());

    // ui.

    let scoreUi = new Score();
    scoreUi.onScoreChanged(0);
    this.addUi(scoreUi);

    this.addUi(new Energy(player));

    this.on("increaseScore", (ev: IncreaseScoreEvent) => {
      this.score += 1;
      scoreUi.onScoreChanged(this.score);
    });


    // enemies
    let squadron = new Squadron();
    this.add(squadron);

    this.on("squadron-killed", () => {
      this.engine.add(new ex.Timer({
        interval: 500,
        repeats: false,
        fcn: this.finishGame.bind(this)
      }));
    });

    // prepare dramatic zoom in.
    this.camera.zoom(0.1);
    this.camera.pos = new ex.Vector(0, 0);

    this.state = "ingame";
  }

  private finishGame() {
    if (this.state != "ingame") {
      return;
    }

    this.state = "finished";

    this.addUi(new Banner("You win!", "Score: " + this.score));
    this.addUi(new Menu(new Array<Button>(
      new Button("New Game", () => {
        this.engine.goToScene("ingame")
      }),
      new Button("Return to Menu", () => {
        this.engine.goToScene("main-menu");
      })
    ), false));
  }
}
