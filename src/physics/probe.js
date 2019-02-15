import p5 from 'p5';
import { buildOrbitClass } from './orbit';

export const buildProbeClass = p => {
  return class Probe {
    constructor(state, options) {
      this.state = state;
      this.trail = [];
      this.propulsion = p.createVector(0, 0);
      const {
        radius,
        color,
        trailLength
      } = options;
      this.radius = radius || 10;
      this.color = p.color(color) || this.p.color(0);
      this.trailLength = trailLength || 100;
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
      const versorX = p5.Vector.div(v, v.mag());
      const versorZ = p.createVector(0, 0, 1);
      const versorY = p5.Vector.cross(versorZ, versorX);
      const v1 = p5.Vector.add(s, p5.Vector.mult(versorY, 0.8 * this.radius));
      const v2 = p5.Vector.add(s, p5.Vector.mult(versorY, -0.8 * this.radius));
      const v3 = p5.Vector.add(s, p5.Vector.mult(versorX, this.radius));
      p.triangle(v1.x, v1.y, v2.x, v2.y, v3.x, v3.y);
    }

    static get Builder() {
      return class Builder {
        build(parent, r, options) {
          const Orbit = buildOrbitClass(p);
          const theta = !!options
            ? options.theta
            : p.random(0, p.TWO_PI);
          const omega = p.sqrt(parent.mass / (r * r * r));
          const orbit = new Orbit(parent.orbit, r, theta, omega);
          const state = orbit.state();
          const probe = new Probe(state, options);
          return probe;
        }
      }
    }
  }
}

export default {
  buildProbeClass,
}
