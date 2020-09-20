import * as ex from "excalibur";

import {Ingame} from "./scenes/ingame";
import {Game} from "./game";
import {loadAssets, createAssets} from "./assets";





document.title = "Weltraum-Eindringlinge";



const game = new Game();
game.add("ingame", new Ingame(game));

game.start(loadAssets()).then(() => {
  createAssets();
  game.goToScene("ingame");
});
