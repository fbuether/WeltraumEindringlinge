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

  public constructor(pos: Vector, distance: number) {
    super();
    this.graphics = new px.Graphics();

    this.position = pos;
    this.size = 2 + (4 - distance);
    this.velocity = 2 + (4 - distance) * 13;

    let intensity = 0.4 + (0.2 * (4 - distance));
    this.colour = px.utils.rgb2hex([intensity, intensity, intensity]);
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
    super(engine);
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

    let star = new Star(position, distance);
    this.engine.add(star);
    this.engine.render.stage.addChild(star.graphics);
    return star;
  }

  private updateStars() {
    for (let star of this.stars) {
      if (star.position.y > this.engine.render.screen.height) {
        // out of view.
        this.components.delete(star);
        this.engine.render.stage.removeChild(star.graphics);
        this.engine.remove(star);
        star.graphics.destroy();
        this.stars.splice(this.stars.indexOf(star), 1);
      }
    }

    while (this.stars.length <= Starfield.StarCount) {
      this.stars.push(this.createNewStar(false));
    }
  }
}
