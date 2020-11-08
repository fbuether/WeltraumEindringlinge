
import {Engine} from "./engine/Engine";
import {MainMenu} from "./scenes/MainMenu";

// pixi-sound must be linked here already, otherwise some strange kind of
// race condition causes sounds to no be loaded properly. Who knows.
import "pixi-sound";


let engine = Engine.create();
engine.start(MainMenu);
