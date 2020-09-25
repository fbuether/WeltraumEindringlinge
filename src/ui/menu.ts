import {UIComponent} from "../ui/ui-component";
import {Button} from "../ui/button";


export class Menu extends UIComponent {
  private buttons: Array<Button>;

  public constructor(buttons: Array<Button>, title: boolean) {
    super("div", "ui");
    this.html.id = "menu";
    this.html.className = title ? "titled" : "anon";

    if (title) {
      this.html.insertAdjacentText("afterbegin", "Weltraum-Eindringlinge");
    }

    this.buttons = buttons;
  }

  public activate() {
    super.activate();
    this.buttons.forEach(b => { b.activate(); });
  }

  public update(delta: number) {
    super.update(delta);
    this.buttons.forEach(b => { b.update(delta); });
  }

  public remove() {
    // remove buttons first.
    this.buttons.forEach(b => { b.remove(); });
    super.remove();
  }
}
