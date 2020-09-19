import * as ex from "excalibur";

import {Ingame} from "./scenes/ingame";
import {Game} from "./game";




document.title = "WeltraumEindringlinge";



const game = new Game();
game.add("ingame", new Ingame(game));


const Resources = {
  Sword: new ex.Texture(String(require('./images/3rd/LargeAlien.png').default))
};


let loader = new ex.Loader();
loader.addResource(Resources["Sword"]);



game.start(loader).then(() => {
  game.goToScene("ingame");
});
