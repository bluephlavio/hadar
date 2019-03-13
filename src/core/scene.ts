import p5 from 'p5';
import { Object, System } from './object';
import Probe from './probe';

export class Scene implements Object {
  system: System;
  host: Probe;
  guests: Array<Probe>;

  constructor(system: System, host: Probe) {
    this.system = system;
    this.host = host;
    this.guests = [];
  }

  addGuests(...guests: Array<Probe>) {
    this.guests.push(...guests);
  }

  evolve(dt: number): void {
    this.system.evolve(dt);
    this.host.evolve(dt);
    for (const guest of this.guests) {
      guest.evolve(dt);
    }
  }

  render(p: p5): void {
    this.system.render(p);
    this.host.render(p);
    for (const guest of this.guests) {
      guest.render(p);
    }
  }

  update(dt: number, p: p5): void {
    this.evolve(dt);
    this.render(p);
  }
}

export default Scene;
