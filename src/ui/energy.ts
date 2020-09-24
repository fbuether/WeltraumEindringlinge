import * as ex from "excalibur";

import {Player} from "../actors/player";


export class Energy extends ex.ScreenElement {
  private display: HTMLElement;
  private bar: HTMLElement;
  private progress: HTMLElement;
  private player: Player;

  public constructor(player: Player) {
    super();
    this.display = document.createElement("div");
    this.bar = document.createElement("div");
    this.progress = document.createElement("div");
    this.player = player;
  }

  public onInitialize(engine: ex.Engine) {
    // this.pos = new ex.Vector(-350, -(engine.screen.viewport.height / 2) + 50);

    this.display.className = "energy";
    this.bar.className = "bar";
    this.progress.className = "progress";

    this.display.append("Energy");
    this.display.append(this.bar);
    this.bar.append(this.progress);

    document.getElementById("ui")?.appendChild(this.display);
  }

  public onPostUpdate(engine: ex.Engine, delta: number) {
    let charge = this.player.getCharge();
    this.progress.style.width = (charge * 100) + "%";
  }
}
