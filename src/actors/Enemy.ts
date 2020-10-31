import * as EventEmitter from "eventemitter3";

import {Actor} from "../engine/Actor";
import {Sprite} from "../engine/components/Sprite";
import {Engine} from "../engine/Engine";
import {Loader} from "../engine/Loader";
import {Body} from "../engine/components/Body";
import {Random} from "../engine/Random";

import {Vector} from "../engine/Vector";
import {ShapeGenerator} from "../engine/ShapeGenerator";
import {Explosion} from "../actors/Explosion";


let enemyTexture = Loader.addSpritesheet(
  require("../../assets/images/enemies.png"), {
    frames: {
      "small-1": { frame: {x: 0, y: 0, w: 72, h: 48 } },
      "small-2": { frame: {x: 75, y: 0, w: 72, h: 48 } },
      "glob-1": { frame: {x: 0, y: 49, w: 24, h: 36 } },
      "glob-2": { frame: {x: 27, y: 49, w: 24, h: 36 } }
    },
    animations: {
      "small": [ "small-1", "small-2" ],
      "glob": [ "glob-1", "glob-2" ]
    }
  });


type Events = "destroyed" | "escaped";

export class Enemy extends Actor {
  private static readonly speed: number = 2;

  public readonly events = new EventEmitter<Events>();

  private body: Body;

  public constructor(engine: Engine, position: Vector) {
    super("enemy", engine);

    this.body = new Body(engine, this, {
      shape: new ShapeGenerator().generateFromSpritesheet(
        engine, enemyTexture, "small-1"),
      position: position
    });
    this.add(this.body);

    this.add(new Sprite(engine, this, {
      kind: "animated",
      position: this.body,
      asset: enemyTexture,
      animation: "small",
      speed: 0.8,
      loops: true
    }));
  }

  public update(delta: number) {
    let movement = Enemy.speed * delta / 1000;
    this.body.applyForce(new Vector(0, movement));

    if (!this.body.isOnScreen()) {
      this.events.emit("escaped", this);
      this.kill();
    }
  }

  public kill() {
    this.engine.add(new Explosion(this.engine, this.body.position));
    this.events.emit("destroyed", this);
    super.kill();
  }
}
