
import { bool, int32, MersenneTwister19937, Random as Rnd} from "random-js";


export class Random {
  private static readonly InitialSeed = 174;

  private source: Rnd;

  public constructor(seed?: Random) {
    this.source = new Rnd(MersenneTwister19937.seed(
      seed ? seed.int32() : Random.InitialSeed));
  }

  public fork(): Random {
    return new Random(this);
  }

  public int32(min?: number, max?: number): number {
    if (min && max) {
      return this.source.integer(min, max);
    }
    else {
      return this.source.int32();
    }
  }

  public bool(): boolean {
    return this.source.bool();
  }

  public real(min: number, max: number): number {
    return this.source.real(min, max);
  }
}
