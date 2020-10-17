import * as px from "pixi.js";


export type AssetTag = string;
export type Resources = Map<AssetTag, px.LoaderResource>;

export class Loader {
  private static resources = new Array<AssetTag>();

  public static async loadAll(pxApp: px.Application): Promise<Loader> {
    let pxLoader = pxApp.loader;
    for (let resource of Loader.resources) {
      pxLoader.add(resource);
    }

    return new Promise((resolve, reject) => {
      pxLoader.onError.add(e => reject("pixi Loader failed: " + e));
      pxLoader.load((loader, resources) => {

        let assets: Resources = new Map();
        for (let tag in resources) {
          let res = resources[tag];
          if (res !== undefined) {
            assets.set(tag, res);
          }
        }

        resolve(new Loader(assets));
      });
    });
  }


  private assets: Resources;

  private constructor(assets: Resources) {
    this.assets = assets;
  }

  public static add(requiredFile: { default: string }): string {
    this.resources.push(requiredFile.default);
    return requiredFile.default;
  }


  public get(tag: AssetTag): px.LoaderResource {
    let res = this.assets.get(tag);
    if (res === undefined) {
      throw new Error(`Asset "${tag}" has not been loaded, but was requested.`);
    }

    return res;
  }
}
