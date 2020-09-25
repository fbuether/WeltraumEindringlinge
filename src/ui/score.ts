import {UIComponent} from "../ui/ui-component";


export class Score extends UIComponent {
  public constructor() {
    super("div", "ui");
    this.html.className = "score";
  }

  public onScoreChanged(newScore: number) {
    this.html.textContent = `Score ${newScore}`;
  }
}
