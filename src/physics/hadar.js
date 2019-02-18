import { buildOrbitClass } from './orbit';

export const buildHadarClass = p => {
  const Orbit = buildOrbitClass(p);
  return class Hadar {
    constructor(props) {
      const { orbit, options } = props || {};
      this.orbit = (
          !!orbit &&
          typeof orbit === 'object' &&
          orbit.constructor.name === 'Orbit'
        )
        ? orbit
        : new Orbit();
      this.trail = [];
      const {
        radius,
        color,
        trailLength,
      } = options || {};
      this.radius = (typeof radius === 'number' && radius > 0) ? radius : 10;
      this.color = !!color && typeof color === 'string'
        ? p.color(color)
        : p.color(0);
      this.trailLength = (typeof trailLength === 'number' && trailLength > 0)
        ? trailLength
        : 100;
    }

    evolve(dt) {
      this.trail.push(this.orbit.position().copy());
      if (this.trail.length > this.trailLength) {
        this.trail.shift();
      }
      this.orbit.evolve(dt);
    }

    render() {
      p.noFill();
      for (let i = 0; i < this.trail.length - 1; i++) {
        const s0 = this.trail[i];
        const s = this.trail[i + 1];
        const alpha = p.map(i, 0, this.trail.length, 0, 200);
        p.stroke(p.red(this.color), p.green(this.color), p.blue(this.color), alpha);
        p.line(s0.x, s0.y, s.x, s.y);
      }
      const t = p.millis() / 1e3;
      const f = 1;
      const alpha = p.map(p.cos(p.TWO_PI * f * t), -1, 1, 200, 250);
      p.noStroke();
      p.fill(p.red(this.color), p.green(this.color), p.blue(this.color), alpha);
      const s = this.orbit.position();
      const r = this.radius * (1 + p.sin(p.TWO_PI * f * t) / 5);
      p.ellipse(s.x, s.y, r);
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
          return new Hadar({
            orbit,
            options: this.options
          });
        }
      }
    }
  }
}

export default {
  buildHadarClass,
}
