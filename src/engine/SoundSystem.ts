
import {Loader, AssetTag} from "../engine/Loader";
import {Engine} from "../engine/Engine";
import {Sound} from "../engine/Sound";


interface SoundParam {
  loop?: boolean;
  volume?: number;
  onFinished?: Function;
}


export class SoundSystem {
  private engine: Engine;

  private enabled: boolean = true;

  public constructor(engine: Engine) {
    this.engine = engine;

    let store = window.localStorage.getItem("soundSystem.enabled");
    this.enabled = store !== undefined && store == "yup";
  }

  public play(asset: AssetTag, params?: SoundParam): Sound {
    let sound = this.engine.loader.getSound(asset);

    if (!this.enabled || sound === undefined) {
      return sound;
    }

    if (params !== undefined) {
      sound.loop = params.loop !== undefined && params.loop;

      if (params.volume !== undefined) {
        sound.volume = params.volume;
      }
    }

    if (params !== undefined && params.onFinished !== undefined) {
      sound.play({ complete: (sound: Sound) => {
        if (params.onFinished !== undefined) {
          params.onFinished();
        }
      }});
    }
    else {
      sound.play();
    }

    return sound;
  }

  public toggleEnabled() {
    this.enabled = !this.enabled;
    window.localStorage.setItem(
      "soundSystem.enabled", this.enabled ? "yup" : "nah");
  }

  public isEnabled() {
    return this.enabled;
  }
}
