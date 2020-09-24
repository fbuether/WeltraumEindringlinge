import * as ex from "excalibur";

import {Button} from "../ui/button";


export class Menu extends ex.ScreenElement {
  private buttons: Array<Button>;
  private title: boolean;

  private display: HTMLElement;

  public constructor(buttons: Array<Button>, title: boolean) {
    super();
    this.buttons = buttons;
    this.title = title;

    this.display = document.createElement("div");
  }

  public onInitialize(engine: ex.Engine) {
    this.display.id = "menu";
    this.display.className = this.title ? "titled" : "anon";
    document.getElementById("ui")?.appendChild(this.display);

    if (this.title) {
      this.display.insertAdjacentText("afterbegin", "Weltraum-Eindringlinge");
    }

    this.buttons.forEach(b => {
      b.initFromMenu(engine, this.display);
    });
  }

  public onPreKill(scene: ex.Scene) {
    this.buttons.forEach(b => {
      b.onPreKill(scene);
    });

    document.getElementById("ui")?.removeChild(this.display);
  }
}
