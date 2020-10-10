
import {Engine} from "./engine/Engine";
import {Ingame} from "./scenes/Ingame";
import {MainMenu} from "./scenes/MainMenu";


let engine = Engine.create();
engine.start(Ingame);
