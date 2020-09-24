import * as ex from "excalibur";


export class Button extends ex.ScreenElement {
  private button: HTMLElement;

  private label: string;
  private action: () => void;

  public constructor(label: string, action: () => void) {
    super();

    this.label = label;
    this.action = action;
    this.button = document.createElement("button");
  }

  public onInitialize(engine: ex.Engine) {
    this.button.textContent = this.label;
    this.button.onclick = this.action;
    this.button.className = "button";

    let menu = document.getElementById("menu");
    if (menu == null) {

      let ui = document.getElementById("ui");
      if (ui == null) {
        throw new Error("no ui element.");
      }

      menu = document.createElement("div");
      menu.id = "menu";
      ui.appendChild(menu);
      menu.insertAdjacentText("afterbegin", "Weltraum-Eindringlinge");
    }

    if (menu != null) {
      menu.appendChild(this.button);
    }
    else {
      console.log("could not create menu.");
    }

    this.pos = new ex.Vector(-350, -(engine.screen.viewport.height / 2) + 50);
  }

  public onPreKill(scene: ex.Scene) {
    document.getElementById("menu")?.removeChild(this.button);
  }
}
