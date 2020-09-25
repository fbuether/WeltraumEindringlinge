import {UIComponent} from "../ui/ui-component";


export class Banner extends UIComponent {
  public constructor(text: string, subtitle: string) {
    super("div", "ui");

    this.html.className = "banner";
    this.html.innerText = text;

    let score = document.createElement("div");
    score.innerText = subtitle;
    this.html.append(score);
  }
}
