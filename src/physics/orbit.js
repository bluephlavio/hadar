import p5 from 'p5';
import { buildStateClass } from './state';

export const buildOrbitClass = p => {
  return class Orbit {
    constructor(parent, r, theta, omega) {
      this.parent = parent;
      this.r = r;
      this.theta = theta;
      this.omega = omega;
    }

    evolve(dt) {
      this.theta += this.omega * dt;
    }

    position() {
      const x = this.r * p.cos(this.theta);
      const y = this.r * p.sin(this.theta);
      const s = p.createVector(x, y);
      if (this.parent) {
        s.add(this.parent.position());
      }
      return s;
    }

    velocity() {
      const speed = this.omega * this.r;
      const x = this.r * p.cos(this.theta);
      const y = this.r * p.sin(this.theta);
      const versorR = p.createVector(x, y).normalize();
      const versorZ = p.createVector(0, 0, 1);
      const versorV = p5.Vector.cross(versorZ, versorR);
      const v = p5.Vector.mult(versorV, speed);
      if (this.parent) {
        v.add(this.parent.velocity());
      }
      return v;
    }

    state() {
      const State = buildStateClass(p);
      const s = this.position();
      const v = this.velocity();
      const state = new State(s, v);
      return state;
    }
  }
}

export default {
  buildOrbitClass,
}
