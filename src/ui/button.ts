import {UIComponent} from "../ui/ui-component";


export class Button extends UIComponent {
  public constructor(label: string, action: () => void) {
    super("button", "menu");

    this.html.textContent = label;
    this.html.onclick = action;
  }
}
