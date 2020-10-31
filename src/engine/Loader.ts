import * as px from "pixi.js";


export type AssetTag = string;

// input data.
type PixiSpriteSheetData = {
  frames: { [key: string]: {
    frame: { x: number, y: number, w: number, h: number } } },
  animations?: { [key: string]: Array<string> }
};

type SpriteSheetData = {
  file: AssetTag,
  data: PixiSpriteSheetData
};


// loaded data.

type Sprite = {
  resource: px.LoaderResource,
  sprite: px.Texture
};

type Spritesheet = {
  resource: px.LoaderResource,
  sheet: px.Spritesheet
};


export class Loader {
  private static sprites = new Array<AssetTag>();
  private static spritesheets = new Array<SpriteSheetData>();

  public static async loadAll(pxApp: px.Application): Promise<Loader> {
    let pxLoader = pxApp.loader;
    for (let sprite of Loader.sprites) {
      pxLoader.add(sprite);
    }

    for (let spritesheet of new Set(Loader.spritesheets.map(s => s.file))) {
      pxLoader.add(spritesheet);
    }

    let sprites = new Map<AssetTag, Sprite>();
    let ssloaders = new Array<{
      file: string,
      resource: px.LoaderResource,
      sheet: px.Spritesheet }>();

    await new Promise((resolve, reject) => {
      pxLoader.onError.add(e => reject("pixi Loader failed: " + e));
      pxLoader.load((loader, resources) => {
        for (let tag in resources) {
          let resource = resources[tag];
          if (resource == undefined) {
            continue;
          }

          if (Loader.sprites.includes(tag)) {
            let texture = resource.texture;
            if (texture == undefined || texture == null) {
              console.error(`Loader did not have texture for ${tag}.`);
            }

            sprites.set(tag, { resource: resource, sprite: texture });
          }

          if (Loader.spritesheets.some(s => s.file == tag)) {
            let data: PixiSpriteSheetData & { meta: Object } = {
              frames: {},
              animations: {},
              meta: {}
            };

            for (let sheet of Loader.spritesheets.filter(s => s.file == tag)) {
              data.frames = {...data.frames, ...sheet.data.frames};
              data.animations = {...data.animations, ...sheet.data.animations};
            }

            ssloaders.push({
              file: tag,
              resource: resource,
              sheet: new px.Spritesheet(resource.texture, data)
            });
          }
        }

        resolve();
      });
    });

    let spritesheets = new Map<AssetTag, Spritesheet>();

    await Promise.all(ssloaders.map(loader =>
        new Promise((resolve, reject) => {
          loader.sheet.parse(() => {
            spritesheets.set(loader.file, {
              resource: loader.resource, sheet: loader.sheet
            });
            resolve();
          });
        })));

    return new Loader(sprites, spritesheets);
  }


  private sprites: Map<AssetTag, Sprite>;

  private spritesheets: Map<AssetTag, Spritesheet>;

  private constructor(
    sprites: Map<AssetTag, Sprite>,
    spritesheets: Map<AssetTag, Spritesheet>) {
    this.sprites = sprites;
    this.spritesheets = spritesheets;
  }


  public static addSprite(requiredFile: { default: string }): string {
    Loader.sprites.push(requiredFile.default);
    return requiredFile.default;
  }

  public getSprite(tag: AssetTag): Sprite {
    let sprite = this.sprites.get(tag);
    if (sprite === undefined) {
      throw new Error(`No sprite ${tag} has been loaded.`);
    }

    return sprite;
  }


  public static addSpritesheet(file: { default: string },
      data: PixiSpriteSheetData) {
    Loader.spritesheets.push({ file: file.default, "data": data });
    return file.default;
  }

  public getSpritesheet(tag: AssetTag): Spritesheet {
    let sheet = this.spritesheets.get(tag);
    if (sheet === undefined) {
      throw new Error(`No spritesheet ${tag} has been loaded.`);
    }

    return sheet;
  }
}
