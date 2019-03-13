import p5 from 'p5';
import Orbit from './orbit';
import { System } from './object';

export class Unary extends System {
  static TRAIL_LENGTH = 100;

  trail: Array<p5.Vector>;
  mass: number;
  radius: number;
  color: p5.Color;

  constructor(mass: number, color: p5.Color, orbit?: Orbit) {
    super(!!orbit ? orbit : new Orbit());
    this.trail = [];
    this.mass = mass;
    this.radius = Math.pow(mass, 1/2);
    this.color = color;
  }

  getMass(): number {
    return this.mass;
  }

  getField(s: p5.Vector): p5.Vector {
    const g = new p5.Vector();
    g.set(0, 0);
    const s0 = this.orbit.position();
    const ds = p5.Vector.sub(s, s0);
    const r = ds.mag();
    g.add(p5.Vector.mult(ds, -this.mass / Math.pow(r, 3)));
    g.add(super.getField(s));
    return g;
  }

  evolve(dt: number): void {
    const s = this.orbit.position();
    this.trail.push(s);
    if (this.trail.length > Unary.TRAIL_LENGTH) {
      this.trail.shift();
    }
    super.evolve(dt);
  }

  render(p: p5): void {
    super.render(p);
    
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
      const radius = p.map(i, 0, 3, this.radius, this.radius + 3);
      p.fill(r, g, b, alpha);
      p.stroke(r, g, b, alpha);
      p.ellipse(s.x, s.y, 2 * radius);
    }
  }
}

export default Unary;
