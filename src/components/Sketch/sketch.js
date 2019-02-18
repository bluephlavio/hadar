import {
  buildSysClass,
} from '../../physics';
import { theme } from '../Theme';

const sketch = p => {

  const Sys = buildSysClass(p);

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.sys = new Sys.Builder()
      .fromHierarchy([
        {
          type: 'source',
          mass: 1e3,
          children: [
            {
              type: 'source',
              mass: 1e2,
              orbit: {
                r: 250,
                theta: p.random(0, p.TWO_PI),
              },
              children: [
                {
                  type: 'hadar',
                  orbit: {
                    r: 10,
                    theta: p.random(0, p.TWO_PI),
                  },
                },
              ],
            },
            {
              type: 'probe',
              orbit: {
                r: 200,
                theta: p.random(0, p.TWO_PI),
              },
            }
          ],
        },
      ])
      .build();
  }

  p.draw = () => {
    p.background(255);
    p.sys.evolve(1);
    p.translate(p.width / 2, p.height / 2);
    p.sys.render();
  }

  p.canvasResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  }

}

// const sketch = p => {
//
//   const g = (...attractors) => (s) => {
//     const gField = p.createVector(0, 0);
//     for (let a of attractors) {
//       const ds = p5.Vector.sub(s, a.s);
//       const r = p.max(ds.mag(), 50);
//       const r3 = r * r;
//       gField.add(p5.Vector.mult(ds, -a.m / r3));
//     }
//     return gField;
//   }
//
//   const centralAttractor = {
//     s: p.createVector(-200, 0),
//     m: 1e3,
//   }
//
//   const Obj = buildObjClass(p);
//
//   let sys;
//
//   p.setup = function() {
//     const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
//     canvas.position(0, 0);
//     canvas.style('z-index', -1);
//
//     const objs = [];
//
//     for (let i = 0; i < 10; i++) {
//       const x = p.random(-300, 300);
//       const y = p.random(-300, 300);
//       const v = 25;
//       const vx = p.random(-v, v);
//       const vy = p.random(-v, v);
//       const r = p.random(3, 8);
//       const c = theme.palette.primary.main;
//       const trailLength = 25;
//       const obj = new Obj(x, y, vx, vy, r, c, trailLength);
//       obj.g = g(centralAttractor);
//       objs.push(obj);
//     }
//
//     const x = p.random(-300, 300);
//     const y = p.random(-300,300);
//     const vx = p.random(-25, 25);
//     const vy = p.random(-25, 25);
//     const r = 9;
//     const c = theme.palette.secondary.main;
//     const trailLength = 50;
//     const obj = new Obj(x, y, vx, vy, r, c, trailLength);
//     obj.g = g(centralAttractor);
//     objs.push(obj);
//
//     sys = new Sys(objs);
//   }
//
//   p.draw = function() {
//     p.background(255);
//     p.translate(p.width / 2, p.height / 2);
//     sys.update(0.5);
//     sys.draw();
//   }
//
//   p.canvasResized = function() {
//     p.resizeCanvas(p.windowWidth, p.windowHeight);
//   }
//
// }

export default sketch;
