import * as ex from 'excalibur';
const sword = require('./images/sword.png');

let Resources = {
  Sword: new ex.Texture(String(sword.default))
};

export { Resources };

