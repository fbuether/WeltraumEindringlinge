import {UIComponent} from "./ui/ui-component";


export class UIContainer {
  private isActive = false;
  private uiComponents = new Array<UIComponent>();

  public add(component: UIComponent) {
    this.uiComponents.push(component);

    if (this.isActive) {
      component.activate();
    }
  }

  public initialize() {
    this.uiComponents.forEach(c => {
      c.activate();
    });

    this.isActive = true;
  }

  public update(delta: number) {
    this.uiComponents.forEach(c => {
      c.update(delta);
    });
  }


  public removeAll() {
    this.uiComponents.forEach(c => {
      c.remove();
    });
  }
}
