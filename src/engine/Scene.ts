
import {Engine} from "../engine/Engine";
import {Actor} from "../engine/Actor";


export type SceneConstructor = new(engine: Engine) => Scene;

export abstract class Scene extends Actor {
}
