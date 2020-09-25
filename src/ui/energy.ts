import {UIComponent} from "../ui/ui-component";
import {Player} from "../actors/player";


export class Energy extends UIComponent {
  private bar: HTMLElement;
  private progress: HTMLElement;
  private player: Player;

  public constructor(player: Player) {
    super("div", "ui");
    this.bar = document.createElement("div");
    this.progress = document.createElement("div");

    this.html.className = "energy";
    this.bar.className = "bar";
    this.progress.className = "progress";

    this.html.append("Energy");
    this.html.append(this.bar);
    this.bar.append(this.progress);

    this.player = player;
  }

  public update(delta: number) {
    let charge = this.player.getCharge();
    this.progress.style.width = (charge * 100) + "%";
  }
}
