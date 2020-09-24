import * as ex from "excalibur";

let spaceInvaders = require("../assets/images/3rd/SpaceInvaders-3.png");




let resources = {
  units: new ex.Texture(String(spaceInvaders.default))
};


interface Assets {
  player: ex.Sprite;
  bullet: ex.Sprite;
  enemy1: Array<ex.Sprite>;
  enemy2: ex.Sprite;
  enemy3: ex.Sprite;
  explosion: Array<ex.Sprite>;
}


let assets: Assets | null = null;



export function loadAssets(): ex.Loader {
  let loader = new ex.Loader();
  loader.addResource(resources.units);
  return loader;
}


function mkSprite(x: number, y: number, width: number, height: number) {
  return new ex.Sprite({
    image: resources.units,
    x: x, y: y, width: width, height: height });
}


export function createAssets(engine: ex.Engine): void {
  assets = {
    player: mkSprite(204, 12, 27, 30),
    bullet: mkSprite(117, 15, 3, 18),
    enemy1: new Array<ex.Sprite>(
      mkSprite(9, 12, 33, 27),
      mkSprite(57, 12, 33, 27)
    ),
    enemy2: mkSprite(12, 60, 24, 24),
    enemy3: mkSprite(12, 108, 27, 24),
    explosion: new Array<ex.Sprite>(
      mkSprite(114, 114, 15, 15),
      mkSprite(99, 156, 39, 27),
      mkSprite(99, 201, 45, 33)
    )
  };
}


export function getAssets(): Assets {
  if (assets == null) {
    throw new Error("requested assets before load.");
  }

  return assets;
}
