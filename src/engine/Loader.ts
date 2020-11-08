import * as px from "pixi.js";
import {default as pxs} from "pixi-sound";


export interface AssetTag {
}

class Tag implements AssetTag {
  private _: "asset-tag" = "asset-tag";
  public readonly id: string;

  public constructor(id: string) {
    this.id = id;
  }

  public toString() {
    return `[Tag: "${this.id}"]`;
  }
}

// input data.
type PixiSpriteSheetData = {
  frames: { [key: string]: {
    frame: { x: number, y: number, w: number, h: number } } },
  animations?: { [key: string]: Array<string> }
};

type SpriteSheetData = {
  file: Tag,
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
  private static sprites = new Array<Tag>();
  private static spritesheets = new Array<SpriteSheetData>();
  private static sounds = new Array<Tag>();

  public static async loadAll(pxApp: px.Application): Promise<Loader> {

    let pxLoader = pxApp.loader;
    for (let sprite of Loader.sprites) {
      pxLoader.add(sprite.id);
    }

    for (let spritesheet of new Set(Loader.spritesheets.map(s => s.file))) {
      pxLoader.add(spritesheet.id);
    }

    for (let sound of Loader.sounds) {
      pxLoader.add(sound.id, sound.id);
    }

    let sprites = new Array<[Tag, Sprite]>();
    let ssloaders = new Array<{
      file: string,
      resource: px.LoaderResource,
      sheet: px.Spritesheet }>();
    let sounds = new Array<[Tag, pxs.Sound]>();

    await new Promise((resolve, reject) => {
      pxLoader.onError.add(e => reject("pixi Loader failed: " + e));
      pxLoader.load((loader, resources) => {
        for (let pxTag in resources) {
          let resource = resources[pxTag];
          if (resource == undefined) {
            continue;
          }

          if (Loader.sprites.find(e => e.id == pxTag)) {
            let texture = resource.texture;
            if (texture == undefined || texture == null) {
              console.error(`Loader did not have texture for ${pxTag}.`);
            }

            sprites.push([new Tag(pxTag), {
              resource: resource,
              sprite: texture
            }]);
          }

          if (Loader.spritesheets.some(s => s.file.id == pxTag)) {
            let data: PixiSpriteSheetData & { meta: Object } = {
              frames: {},
              animations: {},
              meta: {}
            };

            for (let sheet of Loader.spritesheets.filter(s =>
                s.file.id == pxTag)) {
              data.frames = {...data.frames, ...sheet.data.frames};
              data.animations = {...data.animations, ...sheet.data.animations};
            }

            ssloaders.push({
              file: pxTag,
              resource: resource,
              sheet: new px.Spritesheet(resource.texture, data)
            });
          }

          if (Loader.sounds.find(e => e.id == pxTag)) {
            sounds.push([new Tag(pxTag), resource.sound]);
          }
        }

        resolve();
      });
    });

    let spritesheets = new Array<[Tag, Spritesheet]>();

    await Promise.all(ssloaders.map(loader =>
        new Promise((resolve, reject) => {
          loader.sheet.parse(() => {
            spritesheets.push([new Tag(loader.file), {
              resource: loader.resource, sheet: loader.sheet
            }]);
            resolve();
          });
        })));

    return new Loader(sprites, spritesheets, sounds);
  }


  private sprites: Array<[Tag, Sprite]>;
  private spritesheets: Array<[Tag, Spritesheet]>;
  private sounds: Array<[Tag, pxs.Sound]>;

  private constructor(sprites: Array<[Tag, Sprite]>,
      spritesheets: Array<[Tag, Spritesheet]>,
      sounds: Array<[Tag, pxs.Sound]>) {
    this.sprites = sprites;
    this.spritesheets = spritesheets;
    this.sounds = sounds;
  }


  public static addSprite(requiredFile: { default: string }): AssetTag {
    Loader.sprites.push(new Tag(requiredFile.default));
    return new Tag(requiredFile.default);
  }

  public getSprite(tag: AssetTag): Sprite {
    let sprite = this.sprites.find(e => e[0].id == (tag as Tag).id);
    if (sprite === undefined) {
      throw new Error(`No sprite ${tag} has been loaded.`);
    }

    return sprite[1];
  }


  public static addSpritesheet(file: { default: string },
      data: PixiSpriteSheetData): AssetTag {
    let tag = new Tag(file.default);
    Loader.spritesheets.push({ file: tag, "data": data });
    return tag;
  }

  public getSpritesheet(tag: AssetTag): Spritesheet {
    let sheet = this.spritesheets.find(e => e[0].id == (tag as Tag).id);
    if (sheet === undefined) {
      throw new Error(`No spritesheet ${tag} has been loaded.`);
    }

    return sheet[1];
  }


  public static addSound(requiredFile: { default: string }): AssetTag {
    let tag = new Tag(requiredFile.default);
    Loader.sounds.push(tag);
    return tag;
  }

  public getSound(tag: AssetTag): pxs.Sound {
    let sound = this.sounds.find(e => e[0].id == (tag as Tag).id);
    if (sound === undefined) {
      throw new Error(`No sound ${tag} has been loaded.`);
    }

    return sound[1];
  }
}
