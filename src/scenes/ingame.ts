import * as ex from "excalibur";

import {Player} from "../actors/player";
import {Starfield} from "../actors/starfield";
import {Squadron} from "../actors/squadron";
import {IncreaseScoreEvent} from "../actors/increase-score-event";

import {Score} from "../ui/score";
import {Energy} from "../ui/energy";


export class Ingame extends ex.Scene {
  private static readonly kickoffDuration: number = 3; // 3000;

  private score = 0;

  public onInitialize(engine: ex.Engine) {
    this.add(new Starfield());

    let playerY = engine.screen.viewport.height / 2 - 100;

    let player = new Player();
    player.pos = new ex.Vector(0, playerY);
    this.add(player);

    let squadron = new Squadron();
    this.add(squadron);

    // ui.
    let uiScore = new Score();
    uiScore.onScoreChanged(0);
    this.add(uiScore);

    this.add(new Energy(player));

    this.camera.zoom(0.1);
    this.camera.pos = new ex.Vector(0, 0);

    this.on("increaseScore", (ev: IncreaseScoreEvent) => {
      this.score += 1;
      uiScore.onScoreChanged(this.score);
    });
  }

  public onActivate(oldScene: ex.Scene, newScene: ex.Scene) {
    // dramatic zoom in
    this.camera.zoom(1, Ingame.kickoffDuration, ex.EasingFunctions.EaseOutQuad);
  }

  public onDeactivate() {
  }
}
