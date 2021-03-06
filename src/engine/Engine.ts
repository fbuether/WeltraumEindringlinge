import * as px from "pixi.js";
import {default as pxs} from "pixi-sound";
import * as planck from "planck-js";


import {Component} from "../engine/components/Component";
import {Actor} from "../engine/Actor";
import {Renderable} from "../engine/components/Renderable";
import {Updatable} from "../engine/components/Updatable";
import {Body} from "../engine/components/Body";
import {Gui} from "../engine/Gui";
import {SoundSystem} from "../engine/SoundSystem";

import {Scene, SceneConstructor} from "../engine/Scene";
import {Key, Keyboard} from "../engine/Keyboard";
import {Loader} from "../engine/Loader";
import {Random} from "../engine/Random";
import {Loading} from "../scenes/Loading";



export type ScreenSize = {
  top: number;
  bottom: number;
  left: number;
  right: number;
}



export class Engine {
  public readonly render: px.Application;

  public readonly keyboard: Keyboard;

  // One pixel corresponds to this many physics units (1m).
  // multiply Game-Coordinates with this to get physics coordinates.
  public static readonly PhysicsScale: number = 1 / 10;
  public readonly physics: planck.World;

  private _loader: Loader | null = null;

  public readonly random: Random = new Random();

  public readonly sound: SoundSystem = new SoundSystem(this);



  public static create() {
    return new Engine(new Keyboard());
  }

  constructor(keyboard: Keyboard) {
    this.keyboard = keyboard;

    px.settings.SCALE_MODE = px.SCALE_MODES.NEAREST;

    this.render = new px.Application({
      width: 800, height: 800,
      antialias: true,
      sharedTicker: true
    });

    // required for z-sorting.
    this.render.stage.sortableChildren = true;

    // disable pixi ticker
    px.Ticker.shared.autoStart = false;
    px.Ticker.shared.stop();

    let displayDiv = document.getElementById("weltraum-eindringlinge");
    if (displayDiv != null) {
      displayDiv.appendChild(this.render.view);
    }

    this.physics = this.setupPhysics();

    this.fpsDisplay = document.getElementById("fps");
  }

  private setupPhysics() {
    let world = planck.World();

    // bleeeeh. See components/Body:constructor for the setup.
    let bodyOfFixture = (fixture: planck.Fixture) =>
        (fixture.getBody() as any)["component"] as Body;

    world.on("pre-solve", (contact: planck.Contact) => {
      let bodyA = bodyOfFixture(contact.getFixtureA());
      let bodyB = bodyOfFixture(contact.getFixtureB());
      if (bodyA === undefined || bodyB === undefined) {
        throw new Error(`Collision with un-componented body. ${contact}`);
      }

      contact.setEnabled(false);

      this.onNextUpdate(() => {
        bodyA.handleCollision(bodyB);
        bodyB.handleCollision(bodyA);
      });
    });

    return world;
  }


  public get loader(): Loader {
    if (this._loader == null) {
      throw new Error("Requested loader before loading.");
    }

    return this._loader;
  }


  public getScreenBounds(): ScreenSize {
    return this.render.screen;
  }


  public toScene(sceneType: SceneConstructor) {
    console.log("switching: ", sceneType);
    this.unloadEverything();
    this.loadScene(Loading);

    this.delay(800, () => {
      this.unloadEverything();
      this.loadScene(sceneType);
    });
  }

  private loadScene(scene: SceneConstructor): Scene {
    let sceneInstance = new scene(this);
    this.add(sceneInstance);
    return sceneInstance;
  }


  public async start(sceneConstr: SceneConstructor) {
    this._loader = await Loader.loadAll(this.render);
    await Gui.loadFonts();

    let scene = this.loadScene(sceneConstr);
    this.add(...scene.getComponents());
    this.startDraw();
  }



  private updatables = new Set<Updatable>();
  private renderables = new Set<Renderable>();

  public add(...components: Array<Component | Actor>) {
    for (let component of components) {
      if (component instanceof Renderable) {
        this.renderables.add(component);
      }
      if (component instanceof Updatable || Updatable.isUpdatable(component)) {
        this.updatables.add(component);
      }
      if (component instanceof Actor) {
        this.add(...component.getComponents());
      }
    }
  }

  public remove(...components: Array<Component>) {
    for (let component of components) {
      if (component instanceof Renderable) {
        this.renderables.delete(component);
      }
      if (component instanceof Updatable || Updatable.isUpdatable(component)) {
        this.updatables.delete(component);
      }
      if (component instanceof Actor) {
        this.remove(...component.getComponents());
      }

      component.delete();
    }
  }

  private unloadEverything() {
    this.remove(...this.updatables);
    this.remove(...this.renderables);
    this.nextUpdates = new Array<Function>();
    this.delays = new Array<[number,Function]>();
  }


  private nextUpdates = new Array<Function>();
  private delays = new Array<[number,Function]>();

  private doUpdate(delta: number) {
    for (let action of this.nextUpdates) {
      action();
    }

    this.nextUpdates = new Array<Function>();

    for (let delayed of this.delays) {
      delayed[0] -= delta;

      if (delayed[0] <= 0) {
        delayed[1]();
      }
    }

    this.delays = this.delays.filter(d => d[0] > 0);

    for (let updatable of this.updatables) {
      updatable.update(delta);
    }
  }

  private doRender() {
    for (let renderable of this.renderables) {
      renderable.render();
    }
  }

  public onNextUpdate(action: Function) {
    this.nextUpdates.push(action);
  }

  // delay action by delta milliseconds
  public delay(delta: number, action: Function) {
    this.delays.push([delta, action]);
  }

  public async waitFor(delay: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.delay(delay, resolve);
    });
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
      if (this.keyboard.isPressed(Key.X)) {
        console.warn("x pressed. canceling animation.");
        this.run = false;
        pxs.stopAll();
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
