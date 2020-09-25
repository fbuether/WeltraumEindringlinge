import * as ex from "excalibur";

import {Ingame} from "./scenes/ingame";
import {MainMenu} from "./scenes/main-menu";
import {Game} from "./game";
import {loadAssets, createAssets} from "./assets";
import "./ui/style.css";


document.title = "Weltraum-Eindringlinge";


// prepare for ui.
let uiElement = document.createElement("div");
uiElement.id = "ui";
document.body.appendChild(uiElement);



ex.Physics.collisionResolutionStrategy = ex.CollisionResolutionStrategy.Box;
ex.Physics.enabled = true;
ex.Physics.showArea = true;
ex.Physics.showBounds = true;
ex.Physics.showContacts = true;
ex.Physics.showMotionVectors = true;


ex.Logger.getInstance().defaultLevel = ex.LogLevel.Debug;


const game = new Game();

// game.isDebug = true;

game.start(loadAssets()).then(() => {
  createAssets(game);
  game.add("main-menu", new MainMenu(game));
  game.goToScene("main-menu");
});
