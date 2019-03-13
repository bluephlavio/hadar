import p5 from 'p5';
import Orbit from './orbit';
import { FixedOrbitObject } from './object';

export class Hadar extends FixedOrbitObject {
  static RADIUS = 2;
  static OSC_AMP = 1;
  static OSC_FREQ = 1;
  static TRAIL_LENGTH = 100;

  trail: Array<p5.Vector>;
  color: p5.Color;

  constructor(color: p5.Color, orbit?: Orbit) {
    super(orbit);
    this.trail = [];
    this.color = color;
  }

  evolve(dt: number): void {
    const s = this.orbit.position();
    this.trail.push(s);
    if (this.trail.length > Hadar.TRAIL_LENGTH) {
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
    
    const s = this.orbit.position();
    for (let i = 0; i < 3; i++) {
      const alpha = p.map(i, 0, 3, 255, 0);
      const omega = 2 * p.TWO_PI * Hadar.OSC_FREQ;
      const t = p.millis() / 1000;
      const radius = Hadar.RADIUS * (1 + Hadar.OSC_AMP * p.cos(omega * t)) + i;
      p.fill(r, g, b, alpha);
      p.stroke(r, g, b, alpha);
      p.ellipse(s.x, s.y, 2 * radius);
    }
  }
}

export default Hadar;
