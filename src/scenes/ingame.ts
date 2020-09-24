import * as ex from "excalibur";

import {Player} from "../actors/player";
import {Starfield} from "../actors/starfield";
import {Squadron} from "../actors/squadron";
import {IncreaseScoreEvent} from "../actors/increase-score-event";

import {Score} from "../ui/score";
import {Energy} from "../ui/energy";
import {Banner} from "../ui/banner";
import {Button} from "../ui/button";


export class Ingame extends ex.Scene {
  private static readonly kickoffDuration: number = 3; // 3000;

  private score = 0;

  public onInitialize(engine: ex.Engine) {
    let player = new Player();

    // ui.
    let uiScore = new Score();
    uiScore.onScoreChanged(0);
    this.addScreenElement(uiScore);

    this.addScreenElement(new Energy(player));

    this.camera.zoom(0.1);
    this.camera.pos = new ex.Vector(0, 0);

    this.on("increaseScore", (ev: IncreaseScoreEvent) => {
      this.score += 1;
      uiScore.onScoreChanged(this.score);
    });


    // background
    this.add(new Starfield());

    // player
    let playerY = engine.screen.viewport.height / 2 - 100;

    player.pos = new ex.Vector(0, playerY);
    this.add(player);

    // enemies
    let squadron = new Squadron();
    this.add(squadron);

    this.on("squadron-killed", () => {
      engine.add(new ex.Timer({
        interval: 500,
        repeats: false,
        fcn: () => {
          this.addScreenElement(new Banner("You win!"));
          this.addScreenElement(new Button("Leave Game", () =>
              engine.goToScene("menu")));
        }
      }));
    });
  }

  public onActivate(oldScene: ex.Scene, newScene: ex.Scene) {
    // dramatic zoom in
    this.camera.zoom(1, Ingame.kickoffDuration, ex.EasingFunctions.EaseOutQuad);
  }

  public onDeactivate() {
    while (this.screenElements.length > 0) {
      this.screenElements[0].kill();
    }
  }
}
