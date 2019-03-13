import p5 from 'p5';
import State from './state';
import Orbit, { Elements } from './orbit';

export interface Object {
  evolve(dt: number): void;
  render(p: p5): void;
}

export abstract class FixedOrbitObject implements Object {
  orbit: Orbit;

  constructor(orbit?: Orbit) {
    this.orbit = !!orbit ? orbit : new Orbit();
  }

  evolve(dt: number) {
    this.orbit.evolve(dt);
  }

  abstract render(p: p5): void;
}

export abstract class System extends FixedOrbitObject {
  satellites: Array<FixedOrbitObject>;

  constructor(orbit?: Orbit) {
    super(!!orbit ? orbit : new Orbit());
    this.satellites = [];
  }

  addSatellite(satellite: FixedOrbitObject, r: number, theta?: number) {
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
      if (satellite instanceof System) {
        const system = satellite as System;
        g.add(system.getField(s));
      }
    }
    return g;
  }

  evolve(dt: number): void {
    super.evolve(dt);
    for (const satellite of this.satellites) {
      satellite.evolve(dt);
    }
  }

  render(p: p5): void {
    for (const satellite of this.satellites) {
      satellite.render(p);
    }
  }

  abstract getMass(): number;
}

export abstract class DynamicalObject implements Object {
  system: System;
  state: State;
  propulsion: p5.Vector;

  constructor(system: System, state?: State) {
    this.system = system;
    this.state = !!state ? state : new State();
    this.propulsion = new p5.Vector();
    this.propulsion.set(0, 0);
  }

  evolve(dt: number): void {
    const s = this.state.position();
    const g = this.system.getField(s);
    const a = p5.Vector.add(g, this.propulsion);
    this.state.evolve(a, dt);
  }

  abstract render(p: p5): void;
}

export default {
  Object,
  DynamicalObject,
  FixedOrbitObject,
  System,
}