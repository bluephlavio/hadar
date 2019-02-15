import { buildOrbitClass } from './orbit';

export const buildSourceClass = p => {
  return class Source {
    constructor(mass, orbit, options) {
      this.mass = mass;
      this.orbit = orbit;
      this.trail = [];
      const {
        radius,
        color,
        trailLength,
      } = options;
      this.radius = radius || 25;
      this.color = p.color(color) || p.color(0);
      this.trailLength = trailLength || 300;
    }

    evolve(dt) {
      this.trail.push(this.orbit.position().copy());
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
        build(mass, parent, r, options) {
          const Source = buildSourceClass(p);
          const Orbit = buildOrbitClass(p);
          const theta = !!options
            ? options.theta
            : p.random(0, p.TWO_PI);
          const omega = !!parent
            ? p.sqrt(parent.mass / (r * r * r))
            : (options ? options.omega || 0 : 0);
          const parentOrbit = !!parent
            ? parent.orbit
            : null;
          const orbit = new Orbit(parentOrbit, r, theta, omega);
          const source = new Source(mass, orbit, options);
          return source;
        }
      }
    }
  }
}

export default {
  buildSourceClass,
}
