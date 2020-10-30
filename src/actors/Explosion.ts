import * as px from "pixi.js";

import {Engine} from "../engine/Engine";
import {Vector} from "../engine/Vector";
import {Actor} from "../engine/Actor";
import {Loader} from "../engine/Loader";


let spaceInvaderSheet = Loader.addSpritesheet(
  require("../../assets/images/3rd/SpaceInvaders-3.png"), {
    frames: {
      "1": { frame: {x: 99, y: 105, w: 45, h: 33} },
      "2": { frame: {x: 99, y: 153, w: 45, h: 33} },
      "3": { frame: {x: 99, y: 201, w: 45, h: 33} }
    },
    animations: {
      "explosion": ["1", "2", "3"]
    }
  });




export class Explosion extends Actor {

  public constructor(engine: Engine, position: Vector) {
    super("explosion", engine);


    // todo!

    // let sprite = new Sprite(engine, this, );
    // this.add(sprite);

    // let tex = engine.lodaer.get getResource(spaceInvaderSheet).texture;

    // let ss = new px.Spritesheet(tex,
    //   engine.getResource(spaceInvaderSheet).data);

    let ss = engine.loader.getSpritesheet(spaceInvaderSheet).sheet;


    // ss.parse(() => {});

    let sprite = new px.AnimatedSprite(
      ss.animations["explosion"]
      );

    sprite.loop = false;

    sprite.onComplete = () => {
      this.kill();
    };

 // px.Sprite.from(tex);
    sprite.anchor.set(0.5, 0.5);

    sprite.animationSpeed = 3 / 1000;

    engine.render.stage.addChild(sprite);
    sprite.x = position.x;
    sprite.y = position.y;

    this.anim = sprite;

    // let s = engine.getResource(explosionSpritesheet).spritesheet;
  }

  private anim: px.AnimatedSprite;

  public update(delta: number) {
    this.anim.update(delta);

    super.update(delta);
  }
  

  public kill() {
    this.engine.render.stage.removeChild(this.anim);
    super.kill();
  }
}



/*

-import * as ex from "excalibur";
-
-import {getAssets} from "../assets";
-
-
-export class Explosion extends ex.Actor {
-  public onInitialize(engine: ex.Engine) {
-    this.body.collider.type = ex.CollisionType.PreventCollision;
-
-    let expl = new ex.Animation({
-      engine: engine,
-      loop: false, speed: 200,
-      sprites: getAssets().explosion
-    });
-    this.addDrawing("generic", expl);
-
-    this.width = 30;
-    this.height = 30;
-
-    engine.add(new ex.Timer({
-      interval: 800,
-      repeats: false,
-      fcn: () => {
-        this.kill();
-      }
-    }));
-  }
-}


*/
