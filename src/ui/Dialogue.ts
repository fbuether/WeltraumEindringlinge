import * as EventEmitter from "eventemitter3";
import * as px from "pixi.js";

import {Gui} from "../engine/Gui";
import {Vector} from "../engine/Vector";
import {Engine} from "../engine/Engine";
import {Loader} from "../engine/Loader";
import {Sprite} from "../engine/components/Sprite";
import {Text} from "../ui/Text";
import {Sound} from "../engine/Sound";

export enum Character {
  Commander
}


let charTexture = Loader.addSpritesheet(
  require("../../assets/images/characters.png"), {
    frames: {
      "1": {frame: {x: 0, y: 0, w: 25, h: 28} },
      "2": {frame: {x: 0, y: 28, w: 25, h: 28} }
    },
    animations: {
      "commander-talk": ["1", "2"]
    }
  });


let sounds = [
  Loader.addSound(require("../../assets/sounds/talking-blip-1.wav.opus")),
  Loader.addSound(require("../../assets/sounds/talking-blip-2.wav.opus")),
  Loader.addSound(require("../../assets/sounds/talking-blip-3.wav.opus")),
  Loader.addSound(require("../../assets/sounds/talking-blip-4.wav.opus"))
];


type Events = "finished";

export class Dialogue extends Gui {
  private static readonly TimePerChar = 60;
  private static readonly TimeAfterLine = 2000;
  private static readonly SpaceBreak = 120;
  public readonly events = new EventEmitter<Events>();

  private graphics: px.Graphics;
  private uiText: Text;
  private sound: Sound | null = null;

  private text: Array<string>;

  private shownIndex = 0;
  private lineFinished = false;
  private shownChars = 0;
  private finished = false;
  private progress = -200;

  public constructor(engine: Engine, char: Character, text: Array<string>) {
    super("dialogue", engine);

    this.text = text;

    let screen = engine.getScreenBounds();
    this.add(new Sprite(engine, this, {
      kind: "animated",
      asset: charTexture,
      animation: "commander-talk",
      position: new Vector(
        screen.left + 100,
        screen.bottom - (28 * 3 / 2)),
      speed: 0.9,
      scale: new Vector(3, 3),
      zIndex: 11
    }));

    this.graphics = new px.Graphics();
    this.graphics.beginFill(
      px.utils.rgb2hex([0.1, 0.1, 0.1]),
      0.7);
    this.graphics.drawRect(
      screen.left + 50,
      screen.bottom - 28 * 1.2 * 3,
      screen.right - 100,
      28 * 1.2 * 3);
    this.graphics.endFill();
    this.graphics.zIndex = 10;
    this.engine.render.stage.addChild(this.graphics);

    this.uiText = this.add(new Text(engine, {
      position: new Vector(
        screen.left + 100 + (3 * 25),
        screen.bottom - (28 * 1.5 * 3) / 2 - 12),
      text: ""
    }));
  }

  public update(delta: number) {
    if (this.finished) {
      return;
    }

    this.progress += delta;

    if (this.lineFinished) {
      if (this.progress >= Dialogue.TimeAfterLine) {
        this.shownIndex += 1;
        this.shownChars = 0;
        this.lineFinished = false;

        this.updateText();

        if (this.shownIndex >= this.text.length) {
          this.finished = true;
          this.events.emit("finished");
        }

        this.progress -= Dialogue.TimeAfterLine;
      }
    }
    else if (this.progress >= Dialogue.TimePerChar) {
      this.shownChars += 1;
      this.lineFinished = this.shownChars >= this.text[this.shownIndex].length;
      this.updateText();
      this.progress -= Dialogue.TimePerChar;

      if (this.text[this.shownIndex][this.shownChars-1] == " ") {
        this.progress -= Dialogue.SpaceBreak;
      }
    }
  }

  private updateText() {
    if (this.shownIndex >= this.text.length) {
      this.uiText.setText("");
      return;
    }

    if (this.sound == null) {
      this.sound = this.engine.loader.getSound(
        sounds[this.engine.random.int(0, sounds.length-1)]);
      this.sound.volume = 0.4;
      this.sound.play({
        complete: (sound: Sound) => {
          this.sound = null;
        }
      });
    }

    this.uiText.setText(this.text[this.shownIndex].substr(0, this.shownChars));
  }

  public delete() {
    this.engine.render.stage.removeChild(this.graphics);
  }
}
