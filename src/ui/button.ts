import * as ex from "excalibur";


export class Button extends ex.ScreenElement {
  private button: HTMLElement;
  private menu: HTMLElement | null;

  private label: string;
  private action: () => void;

  public constructor(label: string, action: () => void) {
    super();

    this.label = label;
    this.action = action;
    this.button = document.createElement("button");
    this.menu = null;
  }

  public initFromMenu(engine: ex.Engine, menu: HTMLElement) {
    this.menu = menu;

    this.button.textContent = this.label;
    this.button.onclick = this.action;
    this.button.className = "button";
    menu.appendChild(this.button);
  }

  public onPreKill(scene: ex.Scene) {
    this.menu?.removeChild(this.button);
  }
}
