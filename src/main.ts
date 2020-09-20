import * as ex from "excalibur";

import {Ingame} from "./scenes/ingame";
import {Game} from "./game";
import {loadAssets, createAssets} from "./assets";





document.title = "Weltraum-Eindringlinge";



const game = new Game();
game.add("ingame", new Ingame(game));

ex.Physics.collisionResolutionStrategy = ex.CollisionResolutionStrategy.Box;
ex.Physics.enabled = true;
ex.Physics.showArea = true;
ex.Physics.showBounds = true;
ex.Physics.showContacts = true;
ex.Physics.showMotionVectors = true;

// game.isDebug = true;

game.start(loadAssets()).then(() => {
  createAssets(game);
  game.goToScene("ingame");
});
