import * as ex from "excalibur";


export class Score extends ex.ScreenElement {
  private display: HTMLElement;

  public constructor() {
    super();
    this.display = document.createElement("div");
  }

  public onInitialize(engine: ex.Engine) {
    // this.pos = new ex.Vector(-350, -(engine.screen.viewport.height / 2) + 50);

    this.display.className = "score";
    document.getElementById("ui")?.appendChild(this.display);
  }

  public onScoreChanged(newScore: number) {
    this.display.textContent = `Score ${newScore}`;
  }
}
