import p5 from 'p5';
import Orbit from './orbit';
import { System } from './object';

export class Binary extends System {
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
    g.add(super.getField(s));
    return g;
  }

  evolve(dt: number) {
    this.child1.evolve(dt);
    this.child2.evolve(dt);
    super.evolve(dt);
  }

  render(p: p5) {
    this.child1.render(p);
    this.child2.render(p);
    super.render(p);
  }
}

export default Binary;
