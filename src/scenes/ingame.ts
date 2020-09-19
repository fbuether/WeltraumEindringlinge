import * as ex from 'excalibur';

import {Player} from "../actors/player";
import {Starfield} from "../actors/starfield";

export class Ingame extends ex.Scene {
  private static readonly kickoffDuration: number = 3000;

  public onInitialize(engine: ex.Engine) {

    var player = new Player();
    this.add(player);
    player.pos = new ex.Vector(0, engine.halfDrawHeight - 100);

    this.camera.zoom(0.1);
    this.camera.pos = new ex.Vector(0, 0);

    this.add(new Starfield());
  }

  public onActivate(oldScene: ex.Scene, newScene: ex.Scene) {
    // dramatic zoom in
    this.camera.zoom(1, Ingame.kickoffDuration, ex.EasingFunctions.EaseOutQuad);
  }

  public onDeactivate() {
  }
}
