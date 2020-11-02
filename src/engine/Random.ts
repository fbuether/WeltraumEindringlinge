
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

  // generates integer number in [min,max]
  public int(min: number, max: number): number {
    let rnd = this.source.random_excl();
    return Math.floor(rnd * (max - min + 1) + min);
  }

  public int32(): number {
    return this.source.random_int();
  }

  public bool(): boolean {
    return this.source.random() >= 0.5;
  }

  // generates real number in [0,1]
  public real(min: number, max: number): number {
    return min + (this.source.random_incl() * (max-min));
  }
}
