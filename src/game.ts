import * as ex from "excalibur";


export class Game extends ex.Engine {
  constructor() {
    super({
      backgroundColor: ex.Color.fromHSL(0, 0, 0.1),
      displayMode: ex.DisplayMode.FullScreen,
      suppressPlayButton: true,
      pointerScope: ex.Input.PointerScope.Document
    });

    // this.isDebug = true;
  }

  public start(loader: ex.Loader) {
    return super.start(loader);
  }

}
