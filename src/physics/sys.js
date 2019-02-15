import p5 from 'p5';

export const buildSysClass = p => {
  return class Sys {
    constructor(sources, hadar, probes) {
      this.sources = sources;
      this.hadar = hadar;
      this.probes = probes;
    }

    field(s) {
      const g = p.createVector(0, 0);
      for (const source of this.sources) {
        const ds = p5.Vector.sub(s, source.orbit.position());
        const r = ds.mag();
        const r3 = p.max(r * r * r, 1e3);
        g.add(p5.Vector.mult(ds, -source.mass / r3));
      }
      return g;
    }

    evolve(dt) {
      for (const source of this.sources) {
        source.evolve(dt);
      }
      this.hadar.evolve(dt);
      for (const probe of this.probes) {
        const g = this.field(probe.state.position());
        probe.evolve(g, dt);
      }
    }

    render() {
      for (const source of this.sources) {
        source.render();
      }
      this.hadar.render();
      for (const probe of this.probes) {
        probe.render();
      }
    }
  }
}

export default {
  buildSysClass,
}
