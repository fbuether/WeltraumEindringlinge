
import {Vector} from "../engine/Vector";
import {Engine} from "../engine/Engine";
import {Scene} from "../engine/Scene";
import {Starfield} from "../actors/Starfield";
import {Button} from "../ui/Button";
import {Banner} from "../ui/Banner";
import {Ingame} from "../scenes/Ingame";
import {Text} from "../ui/Text";
import {Component} from "../engine/components/Component";


enum State {
  Main,
  LevelSelect
}


export class MainMenu extends Scene {
  private state: State = State.Main;

  private stateComponents = new Array<Component>();

  public constructor(engine: Engine) {
    super("main-menu", engine);

    this.add(new Starfield(engine));
    this.add(new Banner(engine,
      "  WELTRAUM-\nEINDRINGLINGE", "ATTACK FROM OUTER SPACE!", 1/5));

    this.createMain();
  }


  private toState(newState: State) {
    if (this.state == newState) {
      return;
    }

    for (let component of this.stateComponents) {
      this.engine.remove(component);
    }

    this.stateComponents = new Array<Component>();

    switch (newState) {
      case State.Main:
        this.createMain();
        break;
      case State.LevelSelect:
        this.createLevelSelect();
        break;
    }

    this.state = newState;
  }

  private createMain() {
    let screen = this.engine.getScreenBounds();
    let scoreOrNull = window.localStorage.getItem("highscore");
    let score = scoreOrNull == null ? "0" : scoreOrNull;

    this.stateComponents.push(this.add(new Text(this.engine, {
      position: new Vector(
        screen.left + (screen.right - screen.left) / 2,
        (screen.bottom + screen.top) / 2),
      text: "Highscore " + score.padStart(5, "0")
    })));


    this.stateComponents.push(this.add(new Button(this.engine, {
      label: "Start",
      action: () => this.toState(State.LevelSelect),
      position: new Vector(
        screen.left + (screen.right - screen.left) / 4,
        (2 * screen.bottom + screen.top) / 3)
    })));
  }

  private createLevelSelect() {
    let screen = this.engine.getScreenBounds();
    this.stateComponents.push(this.add(new Text(this.engine, {
      position: new Vector(
        screen.left + (screen.right - screen.left) / 6,
        (screen.bottom + screen.top) / 2),
      text: "Select Starting Level:"
    })));

    let n = 8;

    for (let i = 1; i <= n; i++) {
      this.stateComponents.push(this.add(new Button(this.engine, {
        label: "Level " + i,
        action: () => this.startLevel(i),
        position: new Vector(
          screen.left + (screen.right - screen.left) / 6
            + (55 * 3 / 2)
            + (Math.floor((i-1)/(n/2)) * 250),
          (screen.bottom + screen.top) / 2
            + 100
            + ((i-1) % (n/2)) * 60)
      })));
    }
  }

  private startLevel(num: number) {
    this.engine.toScene(Ingame);
  }
}
