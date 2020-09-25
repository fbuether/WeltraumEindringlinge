

export class UIComponent {
  protected html: HTMLElement;

  private parentTarget: "ui" | "menu" | "";

  private onScreen: boolean = false;
  private parent: HTMLElement | null;

  public constructor(className: string = "div",
      parentTarget: "ui" | "menu" | "" = "") {
    this.html = document.createElement(className);
    this.parent = null;

    this.parentTarget = parentTarget;
  }

  // override points.
  public activate() {
    if (this.parentTarget != "") {
      this.addTo(this.parentTarget);
    }
  }

  public update(delta: number) { }

  public remove() {
    if (this.onScreen) {
      this.parent?.removeChild(this.html);
    }
  }


  protected addTo(parentId: string) {
    this.parent = document.getElementById(parentId);
    if (this.parent != null) {
      this.parent.appendChild(this.html);
      this.onScreen = true;
    }
  }
}
