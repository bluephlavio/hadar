import { buildOrbitClass } from './orbit';

export const buildHadarClass = p => {
  return class Hadar {
    constructor(orbit, options) {
      this.orbit = orbit;
      this.trail = [];
      const {
        radius,
        color,
        trailLength,
      } = options;
      this.radius = radius || 10;
      this.color = p.color(color) || p.color(0);
      this.trailLength = trailLength || 100;
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
        build(parent, r, options) {
          const Hadar = buildHadarClass(p);
          const Orbit = buildOrbitClass(p);
          const theta = !!options
            ? options.theta
            : p.random(0, p.TWO_PI);
          const omega = p.sqrt(parent.mass / (r * r * r));
          const orbit = new Orbit(parent.orbit, r, theta, omega);
          const hadar = new Hadar(orbit, options);
          return hadar;
        }
      }
    }
  }
}

export default {
  buildHadarClass,
}
