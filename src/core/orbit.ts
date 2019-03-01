import p5 from 'p5';
import State from './state';

export interface Elements {
  r: number;
  theta: number;
  omega: number;
}

class Orbit {
  elements: Elements;
  parent: Orbit | null;

  constructor(elements?: Elements, parent?: Orbit | null) {
    this.elements = !!elements ? elements : {
      r: 0,
      theta: 0,
      omega: 0,
    };
    this.parent = !!parent ? parent : null;
  }

  isSingular(): boolean {
    const { omega, r } = this.elements;
    return omega === 0 || r === 0;
  }

  evolve(dt: number) {
    const { omega } = this.elements;
    this.elements.theta += omega * dt;
  }

  position(): p5.Vector {
    const { r, theta, omega } = this.elements;
    const x = r * Math.cos(theta);
    const y = r * Math.sin(theta);
    const s: p5.Vector = new p5.Vector();
    s.set(x, y);
    if (this.parent) {
      s.add(this.parent.position());
    }
    return s;
  }

  velocity(): p5.Vector {
    if (this.isSingular()) {
      return !!this.parent ? this.parent.velocity() : new p5.Vector();
    }
    const { r, theta, omega } = this.elements;
    const x = r * Math.cos(theta);
    const y = r * Math.sin(theta);
    const R: p5.Vector = new p5.Vector();
    R.set(x, y, 0);
    const w: p5.Vector = new p5.Vector();
    w.set(0, 0, omega);
    const v: any = p5.Vector.cross(w, R);
    if (this.parent) {
      v.add(this.parent.velocity());
    }
    return v;
  }

  state() {
    return new State(this.position(), this.velocity());
  }

  static get Builder() {
    return class Builder {
      private elements: Elements;
      private parent: Orbit | null;

      constructor() {
        this.parent = null;
        this.elements = {
          r: 0,
          theta: 0,
          omega: 0,
        };
      }

      orbiting(parent: Orbit) {
        this.parent = parent;
        return this;
      }

      withElements(elements: Elements) {
        this.elements = elements;
        return this;
      }

      atDistance(r: number) {
        this.elements.r = r;
        return this;
      }

      withInitialAnomaly(theta: number) {
        this.elements.theta = theta;
        return this;
      }

      withAngularVelocity(omega: number) {
        this.elements.omega = omega;
        return this;
      }

      build() {
        return new Orbit(this.elements, this.parent);
      }
    }
  }
}

export default Orbit;
