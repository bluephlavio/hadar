import p5 from 'p5';
import Orbit, { Elements } from './orbit';

export class System {
  static TRAIL_LENGTH = 100;
  
  orbit: Orbit;
  trail: Array<p5.Vector>;
  satellites: Array<System>;

  constructor(orbit?: Orbit) {
    this.orbit = !!orbit ? orbit : new Orbit();
    this.trail = [];
    this.satellites = [];
  }

  getMass(): number {
    return 0;
  }

  addSatellite(satellite: System, r: number, theta?: number) {
    satellite.orbit.parent = this.orbit;
    satellite.orbit.elements = {
      r,
      theta: !!theta ? theta : Math.random() * 2 * Math.PI,
      omega: Math.sqrt(this.getMass() / Math.pow(r, 3)),
    }
    this.satellites.push(satellite);
  }

  getField(s: p5.Vector): p5.Vector {
    const g = new p5.Vector();
    g.set(0, 0);
    for (const satellite of this.satellites) {
      g.add(satellite.getField(s));
    }
    return g;
  }

  evolve(dt: number) {
    this.trail.push(this.orbit.position());
    if (this.trail.length > System.TRAIL_LENGTH) {
      this.trail.shift();
    }
    this.orbit.evolve(dt);
    for (const satellite of this.satellites) {
      satellite.evolve(dt);
    }
  }

  render(p: p5) {
    for (const satellite of this.satellites) {
      satellite.render(p);
    }
  }
}

export class UnarySystem extends System {
  mass: number;
  radius: number;
  color: any;

  constructor(mass: number, color = '#ffffff', orbit?: Orbit) {
    super(!!orbit ? orbit : new Orbit());
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
    const ds = p5.Vector.sub(s, this.orbit.position());
    const r = ds.mag();
    g.add(p5.Vector.mult(ds, -this.mass / Math.pow(r, 3)));
    for (const satellite of this.satellites) {
      g.add(satellite.getField(s));
    }
    return g;
  }

  render(p: p5) {
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

export class BinarySystem extends System {
  child1: System;
  child2: System;
  d: number;

  constructor(child1: System, child2: System, d: number, orbit?: Orbit) {
    super(!!orbit ? orbit : new Orbit());
    this.child1 = child1;
    this.child2 = child2;
    this.d = d;
    const m1 = this.child1.getMass();
    const m2 = this.child2.getMass();
    const m = m1 + m2;
    const r1 = m2 / m * this.d;
    const r2 = m1 / m * this.d;
    const omega = Math.sqrt(m / Math.pow(d, 3));
    const theta = Math.random() * 2 * Math.PI;
    this.child1.orbit.parent = this.orbit;
    this.child1.orbit.elements = {
      r: r1,
      theta,
      omega,
    }
    this.child2.orbit.parent = this.orbit;
    this.child2.orbit.elements = {
      r: r2,
      theta: theta + Math.PI,
      omega,
    }
  }

  getMass(): number {
    return this.child1.getMass() + this.child2.getMass();
  }

  getField(s: p5.Vector): p5.Vector {
    const g = new p5.Vector();
    g.set(0, 0);
    g.add(this.child1.getField(s));
    g.add(this.child2.getField(s));
    for (const satellite of this.satellites) {
      g.add(satellite.getField(s));
    }
    return g;
  }

  evolve(dt: number) {
    super.evolve(dt);
    this.child1.evolve(dt);
    this.child2.evolve(dt);
  }

  render(p: p5) {
    super.render(p);
    this.child1.render(p);
    this.child2.render(p);
  }
}

export default {
  UnarySystem,
  BinarySystem,
}