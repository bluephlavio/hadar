import p5 from 'p5';
import { buildStateClass } from './state';

export const buildOrbitClass = p => {
  const State = buildStateClass(p);
  return class Orbit {
    constructor(elements, parent) {
      const { r, theta, omega } = elements || {};
      this.r = (typeof r === 'number' && r >= 0 ) ? r : 0;
      this.theta = (typeof theta === 'number') ? theta : 0;
      this.omega = (typeof omega === 'number') ? omega : 0;
      this.parent = (
          !!parent &&
          typeof parent === 'object' &&
          parent.constructor.name === 'Orbit'
        )
        ? parent
        : null;
    }

    isSingular() {
      return this.omega === 0 || this.r === 0;
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
      if (this.isSingular()) {
        return !!this.parent ? this.parent.velocity() : p.createVector(0, 0);
      }
      const x = this.r * p.cos(this.theta);
      const y = this.r * p.sin(this.theta);
      const r = p.createVector(x, y, 0);
      const omega = p.createVector(0, 0, this.omega);
      const v = p5.Vector.cross(omega, r);
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
          return new Orbit({
            r: this.r,
            theta: this.theta,
            omega: this.omega
          }, this.parent);
        }
      }
    }
  }
}

export default {
  buildOrbitClass,
}
