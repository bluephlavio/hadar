import p5 from 'p5';
import { buildSourceClass } from './source';
import { buildHadarClass } from './hadar';
import { buildProbeClass } from './probe';

export const buildSysClass = p => {
  const Source = buildSourceClass(p);
  const Hadar = buildHadarClass(p);
  const Probe = buildProbeClass(p);
  return class Sys {
    constructor(props) {
      const { sources, hadars, probes } = props;
      this.sources = sources;
      this.hadars = hadars;
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
      for (const hadar of this.hadars) {
        hadar.evolve(dt);
      }
      for (const probe of this.probes) {
        const g = this.field(probe.state.position());
        probe.evolve(g, dt);
      }
    }

    render() {
      for (const source of this.sources) {
        source.render();
      }
      for (const hadar of this.hadars) {
        hadar.render();
      }
      for (const probe of this.probes) {
        probe.render();
      }
    }

    static get Builder() {
      return class Builder {
        withSources(sources) {
          this.sources = sources;
          return this;
        }

        withHadars(hadars) {
          this.hadars = hadars;
          return this;
        }

        withProbes(probes) {
          this.probes = probes;
          return this;
        }

        buildHierarchyNode(node, parent) {
          const sources = [];
          const hadars = [];
          const probes = [];
          const { type } = node || {};
          if (type === 'source') {
            const { mass } = node || {};
            const { r, theta } = !!node ? node.orbit : {};
            const source = new Source.Builder()
              .withMass(mass)
              .orbiting(parent)
              .atDistance(r)
              .withInitialAnomaly(theta)
              .build();
            sources.push(source);
            if (node.children) {
              for (const child of node.children) {
                const children = this.buildHierarchyNode(child, source);
                sources.push(...children.sources);
                hadars.push(...children.hadars);
                probes.push(...children.probes);
              }
            }
          } else if (type === 'hadar') {
            const { r, theta } = (
                !!node &&
                typeof node === 'object'
              )
              ? node.orbit
              : {};
            const hadar = new Hadar.Builder()
              .orbiting(parent)
              .atDistance(r)
              .withInitialAnomaly(theta)
              .build();
            hadars.push(hadar);
            if (node.children) {
              for (const child of node.children) {
                const children = this.buildHierarchyNode(child, hadar);
                sources.push(...children.sources);
                hadars.push(...children.hadars);
                probes.push(...children.probes);
              }
            }
          } else if (type === 'probe') {
            const { r, theta } = (
                !!node &&
                typeof node === 'object'
              )
              ? node.orbit
              : {};
            const probe = new Probe.Builder()
              .orbiting(parent)
              .atDistance(r)
              .withInitialAnomaly(theta)
              .build();
            probes.push(probe);
            if (node.children) {
              for (const child of node.children) {
                const children = this.buildHierarchyNode(child, probe);
                sources.push(...children.sources);
                hadars.push(...children.hadars);
                probes.push(...children.probes);
              }
            }
          }
          return {
            sources,
            hadars,
            probes,
          }
        }

        fromHierarchy(hierarchy) {
          this.sources = [];
          this.hadars = [];
          this.probes = [];
          for (const node of hierarchy) {
            const children = this.buildHierarchyNode(node);
            this.sources.push(...children.sources);
            this.hadars.push(...children.hadars);
            this.probes.push(...children.probes);
          }
          return this;
        }

        build() {
          return new Sys({
            sources: this.sources,
            hadars: this.hadars,
            probes: this.probes,
          });
        }
      }
    }
  }
}

export default {
  buildSysClass,
}
