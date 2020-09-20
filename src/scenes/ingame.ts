import * as ex from 'excalibur';

import {Player} from "../actors/player";
import {Starfield} from "../actors/starfield";
import {Enemy} from "../actors/enemy";


export class Ingame extends ex.Scene {
  private static readonly kickoffDuration: number = 3; // 3000;

  public onInitialize(engine: ex.Engine) {

    this.add(new Starfield());

    let playerY = engine.screen.viewport.height / 2 - 100;
    let enemyY = -(engine.screen.viewport.height / 2) + 100;

    let player = new Player();
    player.pos = new ex.Vector(0, playerY);
    this.add(player);

    let enemy = new Enemy();
    enemy.pos = new ex.Vector(0, enemyY);
    this.add(enemy);


    this.camera.zoom(0.1);
    this.camera.pos = new ex.Vector(0, 0);
  }

  public onActivate(oldScene: ex.Scene, newScene: ex.Scene) {
    // dramatic zoom in
    this.camera.zoom(1, Ingame.kickoffDuration, ex.EasingFunctions.EaseOutQuad);
  }

  public onDeactivate() {
  }
}
