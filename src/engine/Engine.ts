import * as px from "pixi.js";
import * as planck from "planck-js";

import {Component} from "../engine/components/Component";
import {Actor} from "../engine/Actor";
import {Renderable} from "../engine/components/Renderable";
import {Deletable} from "../engine/components/Deletable";
import {Updatable} from "../engine/components/Updatable";

import {Vector} from "../engine/Vector";
import {Scene, SceneConstructor} from "../engine/Scene";
import {Keyboard} from "../engine/Keyboard";
import {Loader, AssetTag} from "../engine/Loader";
import {Random} from "../engine/Random";





export class Engine {
  public readonly render: px.Application;

  public readonly keyboard: Keyboard;

  // One pixel corresponds to this many physics units (1m).
  // multiply Game-Coordinates with this to get physics coordinates.
  public static readonly PhysicsScale: number = 1 / 10;
  public readonly physics: planck.World;

  private resources: Loader | null = null;

  public readonly random: Random = new Random();



  public static create() {
    return new Engine(new Keyboard());
  }

  constructor(keyboard: Keyboard) {
    this.keyboard = keyboard;

    this.render = new px.Application({
      width: 800, height: 800,
      antialias: true,
      sharedTicker: true
    });

    // disable pixi ticker
    px.Ticker.shared.autoStart = false;
    px.Ticker.shared.stop();

    let displayDiv = document.getElementById("weltraum-eindringlinge");
    if (displayDiv != null) {
      displayDiv.appendChild(this.render.view);
    }

    this.physics = planck.World();

    this.fpsDisplay = document.getElementById("fps");
  }


  public getResource(tag: AssetTag): px.LoaderResource {
    if (this.resources == null) {
      throw new Error("Requested resource before loading.");
    }

    return this.resources.get(tag);
  }

  public getScreenBounds(): planck.AABB {
    return new planck.AABB(
      new Vector(this.render.screen.left, this.render.screen.top),
      new Vector(this.render.screen.right, this.render.screen.bottom));
  }


  public toScene(sceneType: SceneConstructor) {
    this.loadScene(sceneType);
    console.log("switching: ", sceneType);
  }

  private loadScene(scene: SceneConstructor): Scene {
    return new scene(this);
  }


  public async start(sceneConstr: SceneConstructor) {
    this.resources = await Loader.loadAll(this.render);

    let scene = this.loadScene(sceneConstr);
    this.add(...scene.getActors());
    this.add(Array.from(scene.getActors())
      .flatMap(a => a.getComponents()));

    this.startDraw();
  }



  private updatables = new Set<Updatable>();
  private renderables = new Set<Renderable>();

  public add(...components: Array<Component | Actor>) {
    for (let component of components) {
      if (component instanceof Renderable) {
        this.renderables.add(component);
      }
      if (component instanceof Updatable) {
        this.updatables.add(component);
      }
      if (component instanceof Actor) {
        this.add(...component.getComponents());
      }
    }
  }

  public remove(...components: Array<Component | Actor>) {
    for (let component of components) {
      if (component instanceof Renderable) {
        this.renderables.delete(component);
      }
      if (component instanceof Updatable) {
        this.updatables.delete(component);
      }
      if (component instanceof Deletable) {
        component.onDelete();
      }
      if (component instanceof Actor) {
        this.remove(component.getComponents());
      }
    }
  }

  private doUpdate(delta: number) {
    for (let updatable of this.updatables) {
      updatable.update(delta);
    }
  }

  private doRender() {
    for (let renderable of this.renderables) {
      renderable.render();
    }
  }


  private run = true;
  private fpsDisplay: HTMLElement | null = null;

  private startDraw() {
    this.lastFrame = performance.now();
    this.physicsTime = 0;
    window.setTimeout(this.requestNextDraw.bind(this));
  }

  private requestNextDraw() {
    if (this.run) {
      if (this.keyboard.isPressed("x")) {
        console.warn("x pressed. canceling animation.");
        this.run = false;
        return;
      }

      window.requestAnimationFrame(this.iterateLoop.bind(this));
    }
  }

  private second = 0;
  private fps = 0;
  private lastFrame = 0;
  private physicsTime = 0;

  // run at 60 frames per 1000 milliseconds.
  private static physicsStep = 1000 / 60;

  private iterateLoop(now: number) {

    // Timekeeping.

    let delta = now - this.lastFrame;
    this.lastFrame = now;

    let nowSecond = Math.trunc(now / 1000);
    if (nowSecond != this.second && this.fpsDisplay != null) {
      this.fpsDisplay.innerText = "fps: " + this.fps;
      this.fps = 0;
      this.second = nowSecond;
    }
    this.fps++;


    // Physics.

    this.physicsTime += delta;
    while (this.physicsTime > Engine.physicsStep) {
      this.physics.step(Engine.physicsStep);
      this.physics.clearForces();
      this.physicsTime -= Engine.physicsStep;
    }


    // Updates.

    this.doUpdate(delta);

    // Rendering.

    this.doRender();
    this.render.ticker.update(now);
    // this.render.render();


    this.requestNextDraw();
  }
}
