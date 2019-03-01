import { UnarySystem, BinarySystem } from '../../core/system';
import { theme } from '../Theme';

const sketch = p => {

  const color = theme.palette.primary.main;

  const moon = new UnarySystem(1, color);
  const earth = new UnarySystem(1, color);
  const earthMoonSystem = new BinarySystem(earth, moon, 20);
  const mercury = new UnarySystem(1, color);
  const mars = new UnarySystem(1, color);
  const phobos = new UnarySystem(1, color);
  mars.addSatellite(phobos, 15);
  const sunA1 = new UnarySystem(10, color);
  const sunA2 = new UnarySystem(20, color);
  const sunA = new BinarySystem(sunA1, sunA2, 10);
  const sunB = new UnarySystem(30, color);
  const sys = new BinarySystem(sunA, sunB, 50);
  sys.addSatellite(mercury, 100);
  sys.addSatellite(earthMoonSystem, 200);
  sys.addSatellite(mars, 300);

  let scaleFactor;
  let translationVector;

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    scaleFactor = 1;
    translationVector = p.createVector(p.width / 2, p.height / 2);
  }

  p.draw = () => {
    p.background(255);
    p.translate(translationVector.x, translationVector.y);
    p.scale(scaleFactor);
    sys.evolve(1);
    sys.render(p);
  }

  p.canvasResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  }

  p.mouseWheel = event => {
    scaleFactor += 1e-3 * event.delta;
  }

  p.mouseDragged = () => {
    translationVector.add(p.createVector(p.mouseX - p.pmouseX, p.mouseY - p.pmouseY));
  }

}

export default sketch;
