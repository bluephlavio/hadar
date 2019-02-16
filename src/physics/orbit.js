import p5 from 'p5';
import { buildStateClass } from './state';

export const buildOrbitClass = p => {
  const State = buildStateClass(p);
  return class Orbit {
    constructor(parent, r, theta, omega) {
      this.parent = (
          !!parent &&
          typeof parent === 'object' &&
          parent.constructor.name === 'Orbit'
        )
        ? parent
        : null;
      this.r = (typeof r === 'number' && r >= 0 ) ? r : 0;
      this.theta = (typeof theta === 'number') ? theta : 0;
      this.omega = (typeof omega === 'number') ? omega : 0;
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
      if (this.omega !== 0) {
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
      return !!this.parent ? this.parent.velocity() : p.createVector(0, 0);
    }

    state() {
      const s = this.position();
      const v = this.velocity();
      const state = new State(s, v);
      return state;
    }

    toString() {
      return JSON.stringify({
        parent: this.parent,
        r: this.r,
        theta: this.theta,
        omega: this.omega,
      });
    }

    static get Builder() {
      return class Builder {
        orbiting(parent) {
          this.parent = parent;
          return this;
        }

        atDistance(r) {
          this.r = r;
          return this;
        }

        withInitialAnomaly(theta) {
          this.theta = theta;
          return this;
        }

        withAngularVelocity(omega) {
          this.omega = omega;
          return this;
        }

        build() {
          return new Orbit(this.parent, this.r, this.theta, this.omega);
        }
      }
    }
  }
}

export default {
  buildOrbitClass,
}
