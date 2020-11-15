

export enum Key {
  A = "a",
  D = "d",
  O = "o",
  X = "x",
  Left = "ArrowLeft",
  Right = "ArrowRight",
  Space = " ",
};


export class Keyboard {
  private pressed = new Set<string>();

  public constructor() {
    window.addEventListener("keydown", this.keyDown.bind(this));
    window.addEventListener("keyup", this.keyUp.bind(this));
  }

  private keyDown(event: KeyboardEvent) {
    this.pressed.add(event.key);
  }

  private keyUp(event: KeyboardEvent) {
    this.pressed.delete(event.key);
  }

  public isPressed(key: Key): boolean {
    return this.pressed.has(key);
  }
}
