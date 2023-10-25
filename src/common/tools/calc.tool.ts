import { Operational } from '../models/operational.model';

export abstract class Calc {
  static of(value: number) {
    return new Operational(value);
  }
}
