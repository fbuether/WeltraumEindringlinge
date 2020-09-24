import * as ex from "excalibur";


export class Banner extends ex.ScreenElement {
  private display: HTMLElement;

  public constructor(text: string) {
    super();
    this.display = document.createElement("div");
    this.display.innerText = text;
  }

  public onInitialize(engine: ex.Engine) {
    this.display.className = "banner";
    document.getElementById("ui")?.appendChild(this.display);
  }

  public onScoreChanged(newScore: number) {
    this.display.textContent = `Score ${newScore}`;
  }

  public onPreKill(scene: ex.Scene) {
    document.getElementById("ui")?.removeChild(this.display);
  }
}
