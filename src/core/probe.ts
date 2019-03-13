import p5 from 'p5';
import State from './state';
import Orbit, { Elements } from './orbit';
import { DynamicalObject, System } from './object';

export class Probe extends DynamicalObject {
  static RADIUS = 3;
  static ARROW_SIZE = 12;
  static TRAIL_LENGTH = 100;
  static POWER = 1;

  trail: Array<p5.Vector>
  color: p5.Color;

  constructor(system: System, color: p5.Color, state?: State) {
    super(system, !!state ? state : new State());
    this.trail = [];
    this.color = color;
  }

  fire(forward: boolean) {
    const a = this.state.velocity().normalize();
    if (forward) {
      a.mult(Probe.POWER);
    } else {
      a.mult(-Probe.POWER);
    }
    this.propulsion.set(a.x, a.y);
  }

  evolve(dt: number): void {
    this.trail.push(this.state.position());
    if (this.trail.length > Probe.TRAIL_LENGTH) {
      this.trail.shift();
    }
    super.evolve(dt);
  }

  render(p: p5): void {
    const r = p.red(this.color);
    const g = p.green(this.color);
    const b = p.blue(this.color);
    
    for (let i = 0; i < this.trail.length - 1; i++) {
      const s1 = this.trail[i];
      const s2 = this.trail[i + 1];
      const alpha = p.map(i, 0, this.trail.length, 0, 255);
      p.stroke(r, g, b, alpha);
      p.noFill();
      p.line(s1.x, s1.y, s2.x, s2.y);
    }
    
    const s = this.state.position();
    const v = this.state.velocity();
    for (let i = 0; i < 3; i++) {
      const alpha = p.map(i, 0, 3, 255, 0);
      const radius = p.map(i, 0, 3, Probe.RADIUS, Probe.RADIUS + 3);
      p.fill(r, g, b, alpha);
      p.stroke(r, g, b, alpha);
      p.ellipse(s.x, s.y, 2 * radius);
    }

    p.push();
    p.translate(s.x, s.y);
    p.rotate(v.heading());
    p.fill(this.color);
    p.triangle(0, -Probe.ARROW_SIZE / 2, 0, Probe.ARROW_SIZE / 2, Probe.ARROW_SIZE, 0);
    p.pop();
  }

  static get Builder() {
    return class Builder {
      private system: System;
      private color: any;
      private state: State;

      constructor(system: System) {
        this.system = system;
        this.color = null;
        this.state = new State();
      }

      orbiting(parent: System, r: number, theta?: number) {
        const theta0 = !!theta ? theta : Math.random() * 2 * Math.PI;
        const m = parent.getMass();
        const omega = Math.sqrt(m / Math.pow(r, 3));
        const orbit = new Orbit.Builder()
          .orbiting(parent.orbit)
          .atDistance(r)
          .withInitialAnomaly(theta0)
          .withAngularVelocity(omega)
          .build();
        this.state = orbit.state();
        return this;
      }

      withColor(color: any) {
        this.color = color;
        return this;
      }

      build() {
        return new Probe(this.system, this.color, this.state);
      }
    }
  }
}

export default Probe;
