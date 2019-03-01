import p5 from 'p5';

class State {
  private s: p5.Vector;
  private v: p5.Vector;

  constructor(s: p5.Vector, v: p5.Vector) {
    this.s = s;
    this.v = v;
  }

  evolve(a: p5.Vector, dt: number) {
    this.s.add(p5.Vector.mult(this.v, dt));
    this.v.add(p5.Vector.mult(a, dt));
  }

  position(): p5.Vector {
    return this.s;
  }

  velocity(): p5.Vector {
    return this.v;
  }
}

export default State;
