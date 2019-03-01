import p5 from 'p5';
import { buildOrbitClass } from './orbit';
import { buildStateClass } from './state';

export const buildProbeClass = p => {
  const Orbit = buildOrbitClass(p);
  const State = buildStateClass(p);
  return class Probe {
    constructor(props) {
      const { state, options } = props || {};
      this.state = (
          !!state &&
          typeof state === 'object' &&
          state.constructor.name === 'State'
        )
        ? state
        : new State();
      this.trail = [];
      this.propulsion = p.createVector(0, 0);
      const {
        radius,
        color,
        trailLength
      } = options || {};
      this.radius = (typeof radius === 'number' && radius > 0) ? radius : 10;
      this.color = !!color && typeof color === 'string'
        ? p.color(color)
        : p.color(0);
      this.trailLength = (typeof trailLength === 'number' && trailLength > 0)
        ? trailLength
        : 100;
    }

    evolve(g, dt) {
      this.trail.push(this.state.position().copy());
      if (this.trail.length > this.trailLength) {
        this.trail.shift();
      }
      const a = p5.Vector.add(g, this.propulsion);
      this.state.evolve(a, dt);
    }

    render() {
      p.noFill();
      for (let i = 0; i < this.trail.length - 1; i++) {
        const s0 = this.trail[i];
        const s = this.trail[i + 1];
        const alpha = p.map(i, 0, this.trail.length, 0, 255);
        p.stroke(p.red(this.color), p.green(this.color), p.blue(this.color), alpha);
        p.line(s0.x, s0.y, s.x, s.y);
      }
      p.noStroke();
      p.fill(this.color);
      const s = this.state.position();
      p.ellipse(s.x, s.y, this.radius);
      const v = this.state.velocity();
      const versorX = v.mag() > 0
        ? p5.Vector.div(v, v.mag())
        : p.createVector(1, 0, 0);
      const versorZ = p.createVector(0, 0, 1);
      const versorY = p5.Vector.cross(versorZ, versorX);
      const v1 = p5.Vector.add(s, p5.Vector.mult(versorY, 0.8 * this.radius));
      const v2 = p5.Vector.add(s, p5.Vector.mult(versorY, -0.8 * this.radius));
      const v3 = p5.Vector.add(s, p5.Vector.mult(versorX, this.radius));
      p.triangle(v1.x, v1.y, v2.x, v2.y, v3.x, v3.y);
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

        withMass(mass) {
          this.mass = mass;
          return this;
        }

        withOptions(options) {
          this.options = options;
          return this;
        }

        build() {
          const r3 = (typeof this.r === 'number' && this.r > 0)
            ? Math.pow(this.r, 3)
            : 0;
          const omega = (
              r3 > 0 &&
              !!this.parent &&
              typeof this.parent === 'object' &&
              this.parent.constructor.name === 'Source'
            )
            ? Math.sqrt(this.parent.mass / r3)
            : 0;
          const parentOrbit = (
              !!this.parent &&
              typeof this.parent === 'object' &&
              this.parent.constructor.name === 'Source'
            )
            ? this.parent.orbit
            : null;
          const orbit = new Orbit.Builder()
            .orbiting(parentOrbit)
            .atDistance(this.r)
            .withInitialAnomaly(this.theta)
            .withAngularVelocity(omega)
            .build();
          const state = orbit.state();
          return new Probe({
            state,
            options: this.options
          });
        }
      }
    }
  }
}

export default {
  buildProbeClass,
}
