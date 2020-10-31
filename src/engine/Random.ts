
import MersenneTwister = require("mersenne-twister");


export class Random {
  private static readonly InitialSeed = 174;

  private source: MersenneTwister;

  public constructor(seed?: Random) {
    this.source = new MersenneTwister(
      seed ? seed.int32() : Random.InitialSeed);
  }

  public fork(): Random {
    return new Random(this);
  }

  public int32(min?: number, max?: number): number {
    if (min !== undefined && max !== undefined) {
      let rnd = this.source.random_excl();
      return Math.floor(rnd * (max - min + 1) + min);
    }
    else {
      return this.source.random_int();
    }
  }

  public bool(): boolean {
    return this.source.random() >= 0.5;
  }

  public real(min: number, max: number): number {
    return min + (this.source.random_incl() * (max-min));
  }
}
