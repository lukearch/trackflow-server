export class Operational {
  private value: number;

  constructor(value: number) {
    this.value = value;
  }

  percent(value: number) {
    return new Operational((this.value * value) / 100);
  }

  sum(value: number) {
    return new Operational(this.value + value);
  }

  sub(value: number) {
    return new Operational(this.value - value);
  }

  subPercent(value: number) {
    return this.sub(this.percent(value).finish());
  }

  multiply(value: number) {
    return new Operational(this.value * value);
  }

  finish() {
    return this.value;
  }
}
