import p5 from 'p5';

export const buildStateClass = p => {
  return class State {
    constructor(s, v) {
      this.s = s instanceof p5.Vector ? s : p.createVector(0, 0);
      this.v = v instanceof p5.Vector ? v : p.createVector(0, 0);
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
