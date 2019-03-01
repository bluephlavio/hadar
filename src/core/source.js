import { buildOrbitClass } from './orbit';

export const buildSourceClass = p => {
  const Orbit = buildOrbitClass(p);
  return class Source {
    constructor(props) {
      const { mass, orbit, options } = props || {};
      this.mass = (typeof mass === 'number' && mass > 0) ? mass : 1;
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
      p.stroke(this.color);
      for (let i = 0; i < this.trail.length - 1; i++) {
        const s0 = this.trail[i];
        const s = this.trail[i + 1];
        const alpha = p.map(i, 0, this.trail.length, 0, 255);
        p.stroke(p.red(this.color), p.green(this.color), p.blue(this.color), alpha);
        p.line(s0.x, s0.y, s.x, s.y);
      }
      p.noStroke();
      p.fill(this.color);
      const s = this.orbit.position();
      p.ellipse(s.x, s.y, this.radius);
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
          return new Source({
            mass: this.mass,
            orbit,
            options: this.options,
          });
        }
      }
    }
  }
}

export default {
  buildSourceClass,
}
