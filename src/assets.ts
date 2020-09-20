import * as ex from "excalibur";

let spaceInvaders = require("../assets/images/3rd/SpaceInvaders-3.png");




let resources = {
  units: new ex.Texture(String(spaceInvaders.default))
};


interface Assets {
  player: ex.Sprite;
  bullet: ex.Sprite;
  enemy1: ex.Sprite;
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


export function createAssets(engine: ex.Engine): void {
  assets = {
    player: new ex.Sprite({
      image: resources.units,
      x: 204, y: 12,
      width: 27, height: 30
    }),
    bullet: new ex.Sprite({
      image: resources.units,
      x: 117, y: 15,
      width: 3, height: 18
    }),
    enemy1: new ex.Sprite({
      image: resources.units,
      x: 9, y: 12,
      width: 33, height: 24
    }),
    enemy2: new ex.Sprite({
      image: resources.units,
      x: 12, y: 60,
      width: 24, height: 24
    }),
    enemy3: new ex.Sprite({
      image: resources.units,
      x: 12, y: 108,
      width: 27, height: 24
    }),
    explosion: new Array<ex.Sprite>(
      new ex.Sprite({ image: resources.units,
                      x: 114, y: 114, width: 15, height: 15 }),
      new ex.Sprite({ image: resources.units,
                      x: 99, y: 156, width: 39, height: 27 }),
      new ex.Sprite({ image: resources.units,
                      x: 99, y: 201, width: 45, height: 33 })
      )
  };
}


export function getAssets(): Assets {
  if (assets == null) {
    throw new Error("requested assets before load.");
  }

  return assets;
}
