import * as px from "pixi.js";
import * as planck from "planck-js";
import {Shape as planckShape} from "planck-js/lib/shape/index";
import * as EventEmitter from "eventemitter3";

import {Engine} from "../../engine/Engine";
import {Vector} from "../../engine/Vector";
import {Positioned} from "../../engine/components/Positioned";
import {Component} from "../../engine/components/Component";
import {Actor} from "../../engine/Actor";


export interface BodyConfig {
  shape: planckShape;
  position: Vector;
  isBullet?: boolean;
  damping?: number;
  force?: Vector;
}


export class Body extends Component implements Positioned {
  private body: planck.Body;
  private engine: Engine;
  public readonly events = new EventEmitter<"collision">();

  // Getter/Setter from the outside, so game-scale values.
  get position(): Vector {
    return this.body.getPosition().clone().mul(1 / Engine.PhysicsScale);
  }

  private _size: Vector | null = null;
  get size(): Vector {
    if (this._size == null) {

      let fixture = this.body.getFixtureList();
      if (fixture != null) {
        let shape = fixture.getShape();
        if (shape instanceof planck.Box) {
          let box = shape as planckShape;

          let bb = new planck.AABB();
          box.computeAABB(bb, new planck.Transform());

          // extents are half-lengths.
          this._size = bb.getExtents().mul(2 / Engine.PhysicsScale);
        }
        else {
          this._size = Vector.zero();
        }
      }
      else {
        this._size = Vector.zero();
      }
    }
    return this._size;
  }

  set position(position: Vector) {
    let phyPosition = position.clone().mul(Engine.PhysicsScale);
    this.body.setPosition(phyPosition);
  }


  constructor(engine: Engine, parent: Component, config: BodyConfig) {
    super("body", parent);
    this.engine = engine;

    let phyPosition = config.position.clone().mul(Engine.PhysicsScale);
    this.body = engine.physics.createBody({
      type: "dynamic",
      position: phyPosition,
      bullet: config.isBullet !== undefined && config.isBullet,
      fixedRotation: true,
      linearDamping: config.damping !== undefined ? config.damping : 1
    });

    this.body.createFixture(config.shape);

    if (config.force !== undefined) {
      this.applyForce(config.force.clone());
    }

    // bleeeh. attach us to this body.
    (this.body as any)["component"] = this;
  }

  public delete() {
    this.engine.physics.destroyBody(this.body);
    this.events.removeAllListeners();
  }


  public applyForce(delta: Vector): void {
    let phyForce = delta.mul(Engine.PhysicsScale);
    this.body.applyForceToCenter(phyForce, true);
  }


  public applyImpulse(delta: Vector): void {
    let phyDelta = delta.mul(Engine.PhysicsScale);
    this.body.applyLinearImpulse(phyDelta, this.body.getLocalCenter(), true);
  }


  public isOnScreen(): boolean {
    let screenBounds = this.engine.getScreenBounds();

    let worldBounds = new planck.AABB(
      new Vector(
        screenBounds.left * Engine.PhysicsScale,
        screenBounds.top * Engine.PhysicsScale),
      new Vector(
        screenBounds.right * Engine.PhysicsScale,
        screenBounds.bottom * Engine.PhysicsScale));

    let fixture = this.body.getFixtureList();
    while (fixture != null) {
      // this may be a little slow to do every frame. ah well.
      let fixtureAABB = new planck.AABB(
        this.body.getWorldVector(fixture.getAABB(0).lowerBound),
        this.body.getWorldVector(fixture.getAABB(0).upperBound));

      // this ugly thing here circumvents a missing "static".
      if (((planck.AABB as unknown) as planck.AABB).testOverlap(
        worldBounds, fixtureAABB)) {
        return true;
      }

      if (fixture != null) {
        fixture = fixture.getNext();
      }
    }

    return false;
  }


  public handleCollision(other: Body) {
    this.events.emit("collision", other.getActor());
  }
}
