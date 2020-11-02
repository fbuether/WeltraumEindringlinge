import * as px from "pixi.js";

import {Engine} from "../engine/Engine";
import {Actor} from "../engine/Actor";
import {Random} from "../engine/Random";
import {Geometry} from "../engine/components/Geometry";
import {Renderable} from "../engine/components/Renderable";
import {Vector} from "../engine/Vector";


class Star extends Geometry {
  public position: Vector;
  public velocity: number;
  private colour: number;
  private size: number;

  public readonly graphics: px.Graphics;

  private engine: Engine;

  public constructor(engine: Engine, starfield: Starfield,
      pos: Vector, distance: number) {
    super("star", starfield);
    this.engine = engine;
    this.graphics = new px.Graphics();
    this.graphics.zIndex = -100;

    this.position = pos;
    this.size = 2 + (4 - distance);
    this.velocity = 2 + (4 - distance) * 13;

    let intensity = 0.4 + (0.2 * (4 - distance));
    this.colour = px.utils.rgb2hex([intensity, intensity, intensity]);
    this.engine.render.stage.addChild(this.graphics);
  }

  public delete() {
    this.graphics.clear();
    this.graphics.destroy();
    this.engine.render.stage.removeChild(this.graphics);
  }

  public render(): void {
    this.graphics.clear();
    this.graphics.beginFill(this.colour);
    this.graphics.drawRect(
      this.position.x - this.size,
      this.position.y - this.size,
      this.size,
      this.size);
    this.graphics.endFill();
  }
}


export class Starfield extends Actor {
  private static readonly StarCount = 40;

  private rnd: Random;

  private stars = new Array<Star>();

  public constructor(engine: Engine) {
    super("starfield", engine);
    this.rnd = engine.random.fork();

    while (this.stars.length <= Starfield.StarCount) {
      this.stars.push(this.createNewStar(true));
    }
  }

  private lastCheck = 0;

  public update(delta: number) {
    this.lastCheck += delta;
    if (this.lastCheck > 1000) {
      this.updateStars();
      this.lastCheck -= 1000;
    }

    for (let star of this.stars) {
      star.position.y += star.velocity * delta / 1000;
    }
  }

  private createNewStar(everywhere: boolean): Star {
    // three parallax layers, 1 is closest.
    let distance = this.rnd.int32(1, 3);

    let height = this.engine.render.screen.height;
    let width = this.engine.render.screen.width;
    let position = new Vector(
      this.rnd.real(0, width),
      everywhere ? this.rnd.real(0, height) : 0);

    let star = new Star(this.engine, this, position, distance);
    this.engine.add(star);
    return star;
  }

  private updateStars() {
    for (let star of this.stars) {
      if (star.position.y > this.engine.render.screen.height) {
        // out of view.
        this.stars.splice(this.stars.indexOf(star), 1);
        this.engine.remove(star);
      }
    }

    while (this.stars.length <= Starfield.StarCount) {
      this.stars.push(this.createNewStar(false));
    }
  }
}
