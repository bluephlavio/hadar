import p5 from 'p5';

export const buildStateClass = p => {
  return class State {
    constructor(s, v) {
      this.s = s;
      this.v = v;
    }

    evolve(a, dt) {
      this.s.add(p5.Vector.mult(this.v, dt));
      this.v.add(p5.Vector.mult(a, dt));
    }

    position() {
      return this.s;
    }

    velocity() {
      return this.v;
    }
  }
}

export default {
  buildStateClass,
}
