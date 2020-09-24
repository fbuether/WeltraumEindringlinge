import * as ex from 'excalibur';


export class Starfield extends ex.Actor {
  private static readonly count = 40;

  private rnd = new ex.Random();
  private lastCheck = 0;

  public onInitialize(engine: ex.Engine) {
    this.body.collider.type = ex.CollisionType.PreventCollision;

    while (this.children.length < Starfield.count) {
      this.add(this.newStar(engine, true));
    }

    let hw = engine.screen.viewport.width / 2;
    let hh = engine.screen.viewport.height / 2;
  }


  public onPostUpdate(engine: ex.Engine, delta: number) {
    this.lastCheck += delta;
    if (this.lastCheck > 1000) {
      this.updateStars(engine);
      this.lastCheck -= 1000;
    }
  }


  private updateStars(engine: ex.Engine) {
    this.children.forEach(star => {
      if (star.isOffScreen) {
        this.remove(star);
      }
    });

    if (this.children.length < Starfield.count) {
      this.add(this.newStar(engine));
    }
  }


  private newStar(engine: ex.Engine, everywhere: boolean = false): ex.Actor {
    let star = new ex.Actor();

    let hw = engine.screen.viewport.width / 2;
    let hh = engine.screen.viewport.height / 2;
    star.pos = new ex.Vector(
      this.rnd.floating(-hw, hw),
      everywhere ? this.rnd.floating(-hh, hh) : -hh);


    // three parallax layers, 1 is closest.
    let distance = this.rnd.integer(1, 3);

    star.vel = new ex.Vector(0, 2 + (4 - distance) * 3);
    star.width = 2 + (4 - distance);
    star.height = star.width;
    star.color = ex.Color.fromHSL(0, 0, 0.4 + (0.2 * (4 - distance)));
    star.body.collider.type = ex.CollisionType.PreventCollision;
    return star;
  }
}
